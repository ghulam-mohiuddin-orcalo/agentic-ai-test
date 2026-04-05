import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { JiraMCPProvider } from '../mcp/jira.provider';
import { IAgentTask } from '../agents/base.agent';
import { IJiraTicket } from '../mcp/mcp.types';
import { CLASSIFICATION_SYSTEM_PROMPT, CLASSIFICATION_USER_PROMPT } from './prompts';

interface IClassificationResult {
  backend: Array<{ title: string; description: string; priority: number }>;
  frontend: Array<{ title: string; description: string; priority: number }>;
  confidence: number;
  reasoning: string;
}

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jiraProvider: JiraMCPProvider,
    private readonly configService: ConfigService,
  ) {}

  async analyzeTicket(
    ticketKey: string,
    userId: string,
  ): Promise<{ workflowId: string; tasks: IAgentTask[]; ticket: IJiraTicket; confidence: number }> {
    // Step 1: Fetch ticket from Jira
    this.logger.log(`Fetching JIRA ticket: ${ticketKey}`);
    await this.jiraProvider.connect();

    let ticket: IJiraTicket;
    try {
      ticket = await this.jiraProvider.getTicket(ticketKey);
    } finally {
      await this.jiraProvider.disconnect();
    }

    this.logger.log(`Ticket fetched: ${ticket.key} - ${ticket.title}`);

    // Step 2: Create workflow record in ANALYZING state
    const workflow = await this.prisma.workflow.create({
      data: {
        userId,
        ticketKey: ticket.key,
        ticketTitle: ticket.title,
        ticketData: JSON.parse(JSON.stringify(ticket)),
        status: 'ANALYZING',
      },
    });

    // Step 3: Classify using LLM
    this.logger.log('Analyzing ticket with LLM...');
    const classification = await this.classifyWithLLM(ticket);
    this.logger.log(
      `Classification: ${classification.backend.length} backend, ${classification.frontend.length} frontend tasks (confidence: ${classification.confidence})`,
    );

    // Step 4: Update workflow status to PLANNED
    await this.prisma.workflow.update({
      where: { id: workflow.id },
      data: { status: 'PLANNED' },
    });

    // Step 5: Create task records
    const tasks: IAgentTask[] = [];

    for (const [index, task] of classification.backend.entries()) {
      const dbTask = await this.prisma.workflowTask.create({
        data: {
          workflowId: workflow.id,
          type: 'BACKEND',
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: 'PENDING',
          dependencies: [],
        },
      });
      tasks.push({
        id: dbTask.id,
        type: 'backend',
        title: task.title,
        description: task.description,
        priority: task.priority,
        dependencies: [],
      });
    }

    for (const [index, task] of classification.frontend.entries()) {
      const dbTask = await this.prisma.workflowTask.create({
        data: {
          workflowId: workflow.id,
          type: 'FRONTEND',
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: 'PENDING',
          dependencies: [],
        },
      });
      tasks.push({
        id: dbTask.id,
        type: 'frontend',
        title: task.title,
        description: task.description,
        priority: task.priority,
        dependencies: [],
      });
    }

    // Log the classification
    await this.log(workflow.id, 'INFO', 'Ticket classified', {
      backendCount: classification.backend.length,
      frontendCount: classification.frontend.length,
      confidence: classification.confidence,
      reasoning: classification.reasoning,
    });

    return {
      workflowId: workflow.id,
      tasks,
      ticket,
      confidence: classification.confidence,
    };
  }

  private async classifyWithLLM(ticket: IJiraTicket): Promise<IClassificationResult> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      // Fallback: simple keyword-based classification when no API key
      this.logger.warn('OPENAI_API_KEY not set, using fallback classification');
      return this.fallbackClassification(ticket);
    }

    const userPrompt = CLASSIFICATION_USER_PROMPT({
      key: ticket.key,
      title: ticket.title,
      description: ticket.description,
      acceptanceCriteria: ticket.acceptanceCriteria,
      priority: ticket.priority,
      labels: ticket.labels,
    });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: CLASSIFICATION_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.error(`OpenAI classification failed: ${response.status} ${body.slice(0, 200)}`);
        return this.fallbackClassification(ticket);
      }

      const data = await response.json() as {
        choices: Array<{ message: { content: string } }>;
      };
      const content = data.choices[0]?.message?.content || '';

      return this.parseClassification(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`LLM classification error: ${message}`);
      return this.fallbackClassification(ticket);
    }
  }

  private parseClassification(content: string): IClassificationResult {
    try {
      const parsed = JSON.parse(content) as IClassificationResult;
      return {
        backend: Array.isArray(parsed.backend) ? parsed.backend : [],
        frontend: Array.isArray(parsed.frontend) ? parsed.frontend : [],
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
        reasoning: parsed.reasoning || 'No reasoning provided',
      };
    } catch {
      this.logger.error('Failed to parse LLM classification response');
      return { backend: [], frontend: [], confidence: 0, reasoning: 'Parse failure' };
    }
  }

  private fallbackClassification(ticket: IJiraTicket): IClassificationResult {
    const text = `${ticket.title} ${ticket.description} ${ticket.labels.join(' ')}`.toLowerCase();

    const backendKeywords = ['api', 'endpoint', 'database', 'schema', 'migration', 'service', 'controller', 'dto', 'prisma', 'backend', 'server', 'auth', 'guard', 'middleware'];
    const frontendKeywords = ['ui', 'component', 'page', 'form', 'button', 'modal', 'dialog', 'table', 'list', 'frontend', 'react', 'display', 'show', 'render', 'style', 'layout'];

    const hasBackend = backendKeywords.some((k) => text.includes(k));
    const hasFrontend = frontendKeywords.some((k) => text.includes(k));

    const backend = hasBackend || !hasFrontend
      ? [{ title: `Implement: ${ticket.title}`, description: ticket.description, priority: 1 }]
      : [];

    const frontend = hasFrontend || !hasBackend
      ? [{ title: `Build UI: ${ticket.title}`, description: ticket.description, priority: 1 }]
      : [];

    return {
      backend,
      frontend,
      confidence: 0.3,
      reasoning: 'Fallback classification based on keyword matching (no OPENAI_API_KEY configured)',
    };
  }

  private async log(
    workflowId: string,
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    this.logger.log(`[${level}] ${message}`);
    await this.prisma.workflowLog.create({
      data: { workflowId, level, message, metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined },
    });
  }
}
