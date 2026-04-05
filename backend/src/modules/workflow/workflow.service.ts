import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrchestratorService } from './orchestrator/orchestrator.service';
import { AgentRegistry } from './agents/agent-registry';
import { TriggerWorkflowDto, WorkflowQueryDto } from './dto';
import { IAgentTask, IWorkflowContext, IGeneratedFile } from './agents/base.agent';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);
  private readonly projectRoot: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly orchestrator: OrchestratorService,
    private readonly agentRegistry: AgentRegistry,
  ) {
    // Project root is 3 levels up from this file: workflow -> modules -> src -> backend -> [root]
    this.projectRoot = path.resolve(__dirname, '../../../..');
  }

  async triggerWorkflow(userId: string, dto: TriggerWorkflowDto) {
    this.logger.log(`Triggering workflow for ticket: ${dto.ticketKey}`);

    // Step 1: Analyze ticket (fetch + classify)
    const analysis = await this.orchestrator.analyzeTicket(dto.ticketKey, userId);

    // Step 2: If not dry-run, execute the tasks
    if (!dto.dryRun) {
      return this.executeWorkflow(analysis.workflowId, userId, {
        agentFilter: dto.agentFilter,
      });
    }

    return {
      workflowId: analysis.workflowId,
      ticketKey: analysis.ticket.key,
      ticketTitle: analysis.ticket.title,
      confidence: analysis.confidence,
      status: 'PLANNED',
      tasks: analysis.tasks,
      message: 'Dry-run mode. No files generated. Call POST /workflow/:id/execute to run.',
    };
  }

  async executeWorkflow(
    workflowId: string,
    userId: string,
    options?: { agentFilter?: 'backend' | 'frontend'; writeFiles?: boolean },
  ) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { tasks: true },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    if (workflow.userId !== userId) {
      throw new ForbiddenException('Not your workflow');
    }

    this.logger.log(`Executing workflow ${workflowId} (${workflow.tasks.length} tasks)`);

    // Update status to EXECUTING
    await this.prisma.workflow.update({
      where: { id: workflowId },
      data: { status: 'EXECUTING' },
    });

    await this.log(workflowId, 'INFO', 'Workflow execution started');

    // Build workflow context for agents
    const context = await this.buildContext(workflowId, workflow.ticketKey);

    // Filter tasks by agent type if specified
    let tasks = workflow.tasks;
    if (options?.agentFilter) {
      tasks = tasks.filter((t) => t.type.toLowerCase() === options.agentFilter);
    }

    // Sort by priority (highest first)
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

    const results: Array<{
      taskId: string;
      status: string;
      summary: string;
      files: IGeneratedFile[];
      errors: string[];
    }> = [];

    let allFiles: IGeneratedFile[] = [];

    for (const task of sortedTasks) {
      if (task.status === 'COMPLETED') continue;

      // Update task to RUNNING
      await this.prisma.workflowTask.update({
        where: { id: task.id },
        data: { status: 'RUNNING', startedAt: new Date() },
      });

      try {
        const agentType = task.type.toLowerCase() as 'backend' | 'frontend';
        const agent = this.agentRegistry.get(agentType);

        const agentTask: IAgentTask = {
          id: task.id,
          type: agentType,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dependencies: task.dependencies as string[],
        };

        const result = await agent.execute(agentTask, context);

        // Store result in DB
        await this.prisma.workflowTask.update({
          where: { id: task.id },
          data: {
            status: result.status === 'completed' ? 'COMPLETED' : 'FAILED',
            result: JSON.parse(JSON.stringify({
              files: result.files,
              summary: result.summary,
            })),
            error: result.errors.join('; ') || null,
            completedAt: new Date(),
          },
        });

        results.push({
          taskId: task.id,
          status: result.status,
          summary: result.summary,
          files: result.files,
          errors: result.errors,
        });

        allFiles = [...allFiles, ...result.files];

        await this.log(workflowId, 'INFO', `Task completed: ${task.title}`, {
          taskId: task.id,
          fileCount: result.files.length,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await this.prisma.workflowTask.update({
          where: { id: task.id },
          data: {
            status: 'FAILED',
            error: message,
            completedAt: new Date(),
          },
        });

        results.push({
          taskId: task.id,
          status: 'failed',
          summary: `Failed: ${message}`,
          files: [],
          errors: [message],
        });

        await this.log(workflowId, 'ERROR', `Task failed: ${task.title}`, {
          taskId: task.id,
          error: message,
        });
      }
    }

    // Write files if requested
    if (options?.writeFiles && allFiles.length > 0) {
      const writeResults = await this.writeFiles(allFiles);
      await this.log(workflowId, 'INFO', `Files written: ${writeResults.written.length} created/modified, ${writeResults.skipped.length} skipped`);
      allFiles = writeResults.allFiles;
    }

    // Determine final status
    const hasFailures = results.some((r) => r.status === 'failed');
    const finalStatus = hasFailures ? 'FAILED' : 'COMPLETED';

    await this.prisma.workflow.update({
      where: { id: workflowId },
      data: { status: finalStatus },
    });

    await this.log(workflowId, 'INFO', `Workflow ${finalStatus.toLowerCase()}`);

    return {
      workflowId,
      ticketKey: workflow.ticketKey,
      status: finalStatus,
      results,
      files: allFiles,
    };
  }

  async retryTask(workflowId: string, taskId: string, userId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow || workflow.userId !== userId) {
      throw new NotFoundException('Workflow not found');
    }

    const task = await this.prisma.workflowTask.findFirst({
      where: { id: taskId, workflowId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Reset task to PENDING
    await this.prisma.workflowTask.update({
      where: { id: taskId },
      data: { status: 'PENDING', error: null, result: null, startedAt: null, completedAt: null },
    });

    // Re-execute just this task
    const context = await this.buildContext(workflowId, workflow.ticketKey);
    const agentType = task.type.toLowerCase() as 'backend' | 'frontend';
    const agent = this.agentRegistry.get(agentType);

    const agentTask: IAgentTask = {
      id: task.id,
      type: agentType,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dependencies: task.dependencies as string[],
    };

    await this.prisma.workflowTask.update({
      where: { id: taskId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    try {
      const result = await agent.execute(agentTask, context);

      await this.prisma.workflowTask.update({
        where: { id: taskId },
        data: {
          status: result.status === 'completed' ? 'COMPLETED' : 'FAILED',
          result: JSON.parse(JSON.stringify({ files: result.files, summary: result.summary })),
          error: result.errors.join('; ') || null,
          completedAt: new Date(),
        },
      });

      return { taskId, result };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.prisma.workflowTask.update({
        where: { id: taskId },
        data: { status: 'FAILED', error: message, completedAt: new Date() },
      });
      throw error;
    }
  }

  async findAll(userId: string, query: WorkflowQueryDto) {
    const { page = 1, limit = 20, status, ticketKey } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    if (ticketKey) where.ticketKey = { contains: ticketKey, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.workflow.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { _count: { select: { tasks: true, logs: true } } },
      }),
      this.prisma.workflow.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findById(workflowId: string, userId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { tasks: { orderBy: { priority: 'asc' } }, logs: { orderBy: { timestamp: 'desc' }, take: 50 } },
    });

    if (!workflow || workflow.userId !== userId) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async cancel(workflowId: string, userId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow || workflow.userId !== userId) {
      throw new NotFoundException('Workflow not found');
    }

    if (workflow.status === 'COMPLETED' || workflow.status === 'FAILED') {
      throw new ForbiddenException('Cannot cancel a completed or failed workflow');
    }

    // Cancel all pending/running tasks
    await this.prisma.workflowTask.updateMany({
      where: { workflowId, status: { in: ['PENDING', 'RUNNING'] } },
      data: { status: 'SKIPPED' },
    });

    await this.prisma.workflow.update({
      where: { id: workflowId },
      data: { status: 'CANCELLED' },
    });

    await this.log(workflowId, 'INFO', 'Workflow cancelled by user');

    return { message: 'Workflow cancelled', workflowId };
  }

  private async buildContext(workflowId: string, ticketKey: string): Promise<IWorkflowContext> {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    const ticketData = (workflow?.ticketData as unknown) as IWorkflowContext['ticketData'];

    // Read existing Prisma schema
    let existingSchema = '';
    const schemaPath = path.join(this.projectRoot, 'backend/prisma/schema.prisma');
    try {
      existingSchema = fs.readFileSync(schemaPath, 'utf-8');
    } catch {
      this.logger.warn('Could not read Prisma schema for context');
    }

    // Read key project patterns for few-shot context
    const projectPatterns: Record<string, string> = {};
    const patternFiles = [
      'backend/src/modules/agents/agents.controller.ts',
      'backend/src/modules/agents/agents.service.ts',
      'backend/src/modules/agents/dto/create-agent.dto.ts',
      'frontend/src/components/chat/ChatInput.tsx',
      'frontend/src/store/api/baseApi.ts',
    ];

    for (const relPath of patternFiles) {
      const fullPath = path.join(this.projectRoot, relPath);
      try {
        projectPatterns[relPath] = fs.readFileSync(fullPath, 'utf-8');
      } catch {
        // Skip files that don't exist
      }
    }

    return {
      ticketKey,
      ticketData,
      existingSchema,
      projectPatterns,
    };
  }

  async writeFiles(files: IGeneratedFile[]): Promise<{
    written: string[];
    skipped: string[];
    allFiles: IGeneratedFile[];
  }> {
    const written: string[] = [];
    const skipped: string[] = [];

    for (const file of files) {
      const fullPath = path.join(this.projectRoot, file.path);

      // Safety: ensure path is within project
      const resolved = path.resolve(fullPath);
      if (!resolved.startsWith(path.resolve(this.projectRoot))) {
        skipped.push(`${file.path} (path traversal detected)`);
        continue;
      }

      try {
        if (file.action === 'create') {
          if (fs.existsSync(resolved)) {
            skipped.push(`${file.path} (already exists)`);
            continue;
          }

          // Ensure directory exists
          const dir = path.dirname(resolved);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.writeFileSync(resolved, file.content, 'utf-8');
          written.push(file.path);
        } else if (file.action === 'modify') {
          if (!fs.existsSync(resolved)) {
            skipped.push(`${file.path} (does not exist, cannot modify)`);
            continue;
          }

          fs.writeFileSync(resolved, file.content, 'utf-8');
          written.push(file.path);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        skipped.push(`${file.path} (${message})`);
      }
    }

    return { written, skipped, allFiles: files };
  }

  private async log(
    workflowId: string,
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const logFn = level === 'ERROR' ? this.logger.error : level === 'WARN' ? this.logger.warn : this.logger.log;
    logFn.call(this.logger, `[${level}] ${message}`);

    try {
      await this.prisma.workflowLog.create({
        data: { workflowId, level, message, metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined },
      });
    } catch {
      // Don't fail workflow if logging fails
    }
  }
}
