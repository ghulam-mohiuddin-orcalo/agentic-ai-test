import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMCPProvider, IJiraTicket, IMCPServerConfig } from './mcp.types';
import { MCPClient } from './mcp-client';

@Injectable()
export class JiraMCPProvider implements IMCPProvider {
  private readonly logger = new Logger(JiraMCPProvider.name);
  private mcpClient: MCPClient | null = null;
  private mcpServerUrl: string | null = null;
  private domain = '';
  private email = '';
  private apiToken = '';
  private maxRetries: number;

  constructor(private readonly configService: ConfigService) {
    this.mcpServerUrl = this.configService.get<string>('JIRA_MCP_SERVER_URL') || '';
    this.domain = this.configService.get<string>('JIRA_DOMAIN') || '';
    this.email = this.configService.get<string>('JIRA_EMAIL') || '';
    this.apiToken = this.configService.get<string>('JIRA_API_TOKEN') || '';
    this.maxRetries = parseInt(
      this.configService.get<string>('WORKFLOW_MAX_RETRIES') || '3',
      10,
    );
  }

  async connect(): Promise<void> {
    if (this.mcpServerUrl) {
      this.logger.log('Connecting to JIRA MCP server...');
      const config: IMCPServerConfig = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-jira'],
        env: {
          JIRA_DOMAIN: this.domain,
          JIRA_EMAIL: this.email,
          JIRA_API_TOKEN: this.apiToken,
        },
        transport: 'stdio',
      };
      this.mcpClient = new MCPClient(config);
      await this.mcpClient.connect();
      this.logger.log('Connected to JIRA MCP server');
    } else {
      this.logger.log('Using direct JIRA REST API (no MCP server configured)');
    }
  }

  async disconnect(): Promise<void> {
    if (this.mcpClient) {
      await this.mcpClient.disconnect();
      this.mcpClient = null;
      this.logger.log('Disconnected from JIRA MCP server');
    }
  }

  async getTicket(ticketId: string): Promise<IJiraTicket> {
    return this.withRetry(async () => {
      if (this.mcpClient) {
        return this.getTicketViaMCP(ticketId);
      }
      return this.getTicketViaREST(ticketId);
    });
  }

  private async getTicketViaREST(ticketId: string): Promise<IJiraTicket> {
    const url = `https://${this.domain}/rest/api/2/issue/${ticketId}`;
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
      }
      throw new Error(`Jira API server error: ${response.status}`);
    }

    const data = await response.json() as Record<string, unknown>;
    return this.mapJiraResponse(data);
  }

  private async getTicketViaMCP(ticketId: string): Promise<IJiraTicket> {
    const result = await this.mcpClient!.request('jira/getTicket', { ticketId });
    return result as IJiraTicket;
  }

  private mapJiraResponse(data: Record<string, unknown>): IJiraTicket {
    const fields = data.fields as Record<string, unknown>;
    const description = (fields?.description as string) || '';

    // Extract acceptance criteria from description (common patterns)
    const acceptanceCriteria = this.extractAcceptanceCriteria(description);

    // Map Jira priority
    const priorityField = fields?.priority as Record<string, unknown> | undefined;
    const priorityName = (priorityField?.name as string) || 'MEDIUM';
    const priority = this.mapPriority(priorityName);

    const assigneeField = fields?.assignee as Record<string, unknown> | undefined;
    const statusField = fields?.status as Record<string, unknown> | undefined;

    return {
      id: data.id as string,
      key: data.key as string,
      title: (fields?.summary as string) || '',
      description,
      acceptanceCriteria,
      priority,
      status: (statusField?.name as string) || '',
      labels: (fields?.labels as string[]) || [],
      assignee: (assigneeField?.displayName as string) || null,
    };
  }

  private extractAcceptanceCriteria(description: string): string[] {
    const criteria: string[] = [];

    // Look for common patterns: "Acceptance Criteria:", "AC:", numbered lists after AC section
    const acPatterns = [
      /(?:Acceptance Criteria|AC)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s|\n\*\*[^A]|\Z)/i,
      /(?:Given|When|Then)[^\n]*/gi,
    ];

    for (const pattern of acPatterns) {
      const matches = description.match(pattern);
      if (matches) {
        for (const match of matches) {
          const lines = match
            .split('\n')
            .map((l) => l.replace(/^[-*]\s*/, '').trim())
            .filter((l) => l.length > 0);
          criteria.push(...lines);
        }
      }
    }

    return criteria.length > 0 ? criteria : ['Implement as described in the ticket'];
  }

  private mapPriority(jiraPriority: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const normalized = jiraPriority.toUpperCase();
    if (normalized.includes('CRITICAL') || normalized.includes('BLOCKER')) return 'CRITICAL';
    if (normalized.includes('HIGH') || normalized.includes('MAJOR')) return 'HIGH';
    if (normalized.includes('LOW') || normalized.includes('MINOR')) return 'LOW';
    return 'MEDIUM';
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const message = lastError.message;

        // Don't retry on 4xx errors
        if (message.includes('400') || message.includes('401') ||
            message.includes('403') || message.includes('404')) {
          throw lastError;
        }

        this.logger.warn(`Attempt ${i + 1}/${this.maxRetries} failed: ${message}`);

        if (i < this.maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    throw new ServiceUnavailableException(
      `Jira API unavailable after ${this.maxRetries} retries: ${lastError?.message}`,
    );
  }
}
