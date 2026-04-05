import { spawn, ChildProcess } from 'child_process';
import { IMCPServerConfig } from './mcp.types';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: Record<string, unknown>;
  id: number;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

export class MCPClient {
  private process: ChildProcess | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, {
    resolve: (value: unknown) => void;
    reject: (reason: Error) => void;
    timeout: ReturnType<typeof setTimeout>;
  }>();
  private buffer = '';
  private timeoutMs: number;

  constructor(private config: IMCPServerConfig, timeoutMs = 30000) {
    this.timeoutMs = timeoutMs;
  }

  async connect(): Promise<void> {
    if (this.config.transport === 'stdio') {
      this.process = spawn(this.config.command, this.config.args, {
        env: { ...process.env, ...this.config.env },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.process.stdout?.on('data', (data: Buffer) => {
        this.handleData(data.toString());
      });

      this.process.stderr?.on('data', (data: Buffer) => {
        console.error('[MCP Client stderr]', data.toString());
      });

      this.process.on('error', (err) => {
        console.error('[MCP Client process error]', err.message);
      });
    }
    // HTTP transport not yet implemented — falls back to direct REST API in provider
  }

  async request(method: string, params: Record<string, unknown>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const rpcRequest: JsonRpcRequest = {
        jsonrpc: '2.0',
        method,
        params,
        id,
      };

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`MCP request timeout: ${method}`));
      }, this.timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timeout });

      const message = JSON.stringify(rpcRequest) + '\n';
      this.process?.stdin?.write(message);
    });
  }

  async disconnect(): Promise<void> {
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('MCP client disconnected'));
    }
    this.pendingRequests.clear();

    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  private handleData(data: string): void {
    this.buffer += data;

    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const response: JsonRpcResponse = JSON.parse(line);
        const pending = this.pendingRequests.get(response.id);
        if (pending) {
          clearTimeout(pending.timeout);
          this.pendingRequests.delete(response.id);
          if (response.error) {
            pending.reject(new Error(response.error.message));
          } else {
            pending.resolve(response.result);
          }
        }
      } catch {
        // Ignore non-JSON lines
      }
    }
  }
}
