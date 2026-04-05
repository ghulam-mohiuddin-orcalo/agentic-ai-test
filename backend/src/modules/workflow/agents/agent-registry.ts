import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseAgent } from './base.agent';

@Injectable()
export class AgentRegistry {
  private agents = new Map<string, BaseAgent>();

  register(agent: BaseAgent): void {
    this.agents.set(agent.type, agent);
  }

  get(type: string): BaseAgent {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new BadRequestException(`Unknown agent type: ${type}. Available: ${this.list().join(', ')}`);
    }
    return agent;
  }

  list(): string[] {
    return [...this.agents.keys()];
  }
}
