import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAgent, IAgentTask, IAgentResult, IGeneratedFile, IWorkflowContext } from './base.agent';
import { BACKEND_CODEGEN_SYSTEM_PROMPT } from '../orchestrator/prompts';

@Injectable()
export class BackendAgent extends BaseAgent {
  private readonly logger = new Logger(BackendAgent.name);

  get type(): 'backend' {
    return 'backend';
  }

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async execute(task: IAgentTask, context: IWorkflowContext): Promise<IAgentResult> {
    const errors: string[] = [];
    const files: IGeneratedFile[] = [];

    try {
      this.logger.log(`Executing backend task: ${task.title}`);

      const userPrompt = this.buildUserPrompt(task, context);
      const response = await this.callOpenAI(userPrompt);

      // Parse generated files from LLM response
      const generatedFiles = this.parseFiles(response);

      // Validate file paths
      for (const file of generatedFiles) {
        if (!this.isValidPath(file.path)) {
          errors.push(`Invalid file path rejected: ${file.path}`);
          continue;
        }
        files.push(file);
      }

      this.logger.log(`Backend agent generated ${files.length} files for: ${task.title}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Backend agent failed: ${message}`);
      errors.push(message);
    }

    return {
      taskId: task.id,
      status: files.length > 0 ? (errors.length > 0 ? 'partial' : 'completed') : 'failed',
      files,
      summary: `Generated ${files.length} backend files for: ${task.title}`,
      errors,
    };
  }

  private buildUserPrompt(task: IAgentTask, context: IWorkflowContext): string {
    return `You are generating backend code for the NexusAI platform (NestJS 10 + Prisma + PostgreSQL).

TICKET: ${context.ticketKey} - ${context.ticketData.title}
TASK: ${task.title}
DESCRIPTION: ${task.description}
PRIORITY: ${task.priority}

EXISTING PRISMA SCHEMA:
\`\`\`prisma
${context.existingSchema.slice(0, 3000)}
\`\`\`

EXISTING CODE PATTERNS (for reference):
${Object.entries(context.projectPatterns)
  .map(([path, content]) => `--- ${path} ---\n${content.slice(0, 1000)}`)
  .join('\n\n')}

Generate the required files. Each file must follow NestJS conventions exactly:
- Controllers: @Controller, @UseGuards(JwtAuthGuard), @ApiTags, thin methods
- Services: @Injectable, PrismaService injection, NestJS exceptions
- DTOs: class-validator decorators, @ApiProperty, barrel export from index.ts
- Modules: register controller + service, export service
- Files: kebab-case naming (e.g., create-resource.dto.ts)

Output strictly JSON:
{
  "files": [
    {
      "path": "backend/src/modules/[module]/[file].ts",
      "content": "full file content as string",
      "action": "create"
    }
  ]
}`;
  }

  private async callOpenAI(userPrompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: BACKEND_CODEGEN_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${body.slice(0, 200)}`);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    return data.choices[0]?.message?.content || '';
  }

  private parseFiles(response: string): IGeneratedFile[] {
    try {
      const parsed = JSON.parse(response) as { files: IGeneratedFile[] };
      return Array.isArray(parsed.files) ? parsed.files : [];
    } catch {
      this.logger.error('Failed to parse LLM response as JSON');
      return [];
    }
  }

  private isValidPath(filePath: string): boolean {
    // Must start with backend/src/ and not contain path traversal
    const normalized = filePath.replace(/\\/g, '/');
    return (
      normalized.startsWith('backend/src/') &&
      !normalized.includes('..') &&
      !normalized.includes('//')
    );
  }
}
