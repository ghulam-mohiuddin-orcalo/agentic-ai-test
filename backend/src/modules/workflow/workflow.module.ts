import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { OrchestratorService } from './orchestrator/orchestrator.service';
import { JiraMCPProvider } from './mcp/jira.provider';
import { BackendAgent } from './agents/backend.agent';
import { FrontendAgent } from './agents/frontend.agent';
import { AgentRegistry } from './agents/agent-registry';

@Module({
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    OrchestratorService,
    JiraMCPProvider,
    BackendAgent,
    FrontendAgent,
    AgentRegistry,
    {
      provide: 'REGISTER_AGENTS',
      useFactory: (
        registry: AgentRegistry,
        backend: BackendAgent,
        frontend: FrontendAgent,
      ) => {
        registry.register(backend);
        registry.register(frontend);
        return registry;
      },
      inject: [AgentRegistry, BackendAgent, FrontendAgent],
    },
  ],
  exports: [WorkflowService],
})
export class WorkflowModule {}
