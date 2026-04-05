export interface IMCPProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getTicket(ticketId: string): Promise<IJiraTicket>;
}

export interface IJiraTicket {
  id: string;
  key: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  labels: string[];
  assignee: string | null;
}

export interface IMCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  transport: 'stdio' | 'http';
}
