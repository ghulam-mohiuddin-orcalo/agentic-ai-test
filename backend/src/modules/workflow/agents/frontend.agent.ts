import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAgent, IAgentTask, IAgentResult, IGeneratedFile, IWorkflowContext } from './base.agent';
import { FRONTEND_CODEGEN_SYSTEM_PROMPT } from '../orchestrator/prompts';

@Injectable()
export class FrontendAgent extends BaseAgent {
  private readonly logger = new Logger(FrontendAgent.name);

  get type(): 'frontend' {
    return 'frontend';
  }

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async execute(task: IAgentTask, context: IWorkflowContext): Promise<IAgentResult> {
    const errors: string[] = [];
    const files: IGeneratedFile[] = [];

    try {
      this.logger.log(`Executing frontend task: ${task.title}`);

      const userPrompt = this.buildUserPrompt(task, context);
      const response = await this.callOpenAI(userPrompt);

      const generatedFiles = this.parseFiles(response);

      for (const file of generatedFiles) {
        if (!this.isValidPath(file.path)) {
          errors.push(`Invalid file path rejected: ${file.path}`);
          continue;
        }
        files.push(file);
      }

      this.logger.log(`Frontend agent generated ${files.length} files for: ${task.title}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Frontend agent failed: ${message}`);
      errors.push(message);
    }

    return {
      taskId: task.id,
      status: files.length > 0 ? (errors.length > 0 ? 'partial' : 'completed') : 'failed',
      files,
      summary: `Generated ${files.length} frontend files for: ${task.title}`,
      errors,
    };
  }

  private buildUserPrompt(task: IAgentTask, context: IWorkflowContext): string {
    return `You are generating frontend code for the NexusAI platform (Next.js 16 + React 19 + MUI 6 + Redux Toolkit).

TICKET: ${context.ticketKey} - ${context.ticketData.title}
TASK: ${task.title}
DESCRIPTION: ${task.description}
PRIORITY: ${task.priority}

EXISTING CODE PATTERNS (for reference):
${Object.entries(context.projectPatterns)
  .map(([path, content]) => `--- ${path} ---\n${content.slice(0, 1000)}`)
  .join('\n\n')}

Generate the required files. Each file must follow these conventions exactly:
- Pages: page.tsx in frontend/src/app/[route]/ directory (Next.js App Router)
- Components: PascalCase.tsx in frontend/src/components/[feature]/
- 'use client' only when component needs state, effects, or browser APIs
- MUI components (Box, Stack, Paper, Card, Button, Typography) + CSS variables
- Forms: react-hook-form + zod via @hookform/resolvers/zod
- State: RTK Query for server data, Redux slices for UI state
- Theme: Terracotta #C8622A primary, CSS variables (--accent, --card, --border, etc.)
- API: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'

Output strictly JSON:
{
  "files": [
    {
      "path": "frontend/src/[path]/[file].tsx",
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
          { role: 'system', content: FRONTEND_CODEGEN_SYSTEM_PROMPT },
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
    const normalized = filePath.replace(/\\/g, '/');
    return (
      normalized.startsWith('frontend/src/') &&
      !normalized.includes('..') &&
      !normalized.includes('//')
    );
  }
}
