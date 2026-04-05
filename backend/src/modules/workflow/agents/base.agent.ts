import { IJiraTicket } from '../mcp/mcp.types';

export interface IAgentTask {
  id: string;
  type: 'backend' | 'frontend';
  title: string;
  description: string;
  priority: number;
  dependencies: string[];
}

export interface IWorkflowContext {
  ticketKey: string;
  ticketData: IJiraTicket;
  existingSchema: string;
  projectPatterns: Record<string, string>;
}

export interface IGeneratedFile {
  path: string;
  content: string;
  action: 'create' | 'modify' | 'delete';
}

export interface IAgentResult {
  taskId: string;
  status: 'completed' | 'failed' | 'partial';
  files: IGeneratedFile[];
  summary: string;
  errors: string[];
}

export abstract class BaseAgent {
  abstract get type(): 'backend' | 'frontend';
  abstract execute(task: IAgentTask, context: IWorkflowContext): Promise<IAgentResult>;
}
