import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { OrchestratorService } from './orchestrator/orchestrator.service';
import { AgentRegistry } from './agents/agent-registry';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// Mock factory for PrismaService
function createPrismaMock() {
  const mock = {
    workflow: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    workflowTask: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
    },
    workflowLog: {
      create: jest.fn(),
    },
  };
  return mock;
}

describe('WorkflowService', () => {
  let service: WorkflowService;
  let prismaMock: ReturnType<typeof createPrismaMock>;

  const mockUserId = 'user-clxxxx1234';
  const mockWorkflowId = 'wf-clxxxx5678';
  const mockTicketKey = 'NEXUS-42';

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const orchestratorMock = {
      analyzeTicket: jest.fn().mockResolvedValue({
        workflowId: mockWorkflowId,
        tasks: [
          { id: 'task-1', type: 'backend', title: 'Create endpoint', description: 'Add new API', priority: 1, dependencies: [] },
        ],
        ticket: { key: mockTicketKey, title: 'Test ticket' },
        confidence: 0.9,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: OrchestratorService, useValue: orchestratorMock },
        AgentRegistry,
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
  });

  describe('triggerWorkflow', () => {
    it('should analyze ticket and return plan in dry-run mode', async () => {
      const result = await service.triggerWorkflow(mockUserId, {
        ticketKey: mockTicketKey,
        dryRun: true,
      });

      const typedResult = result as { workflowId: string; status: string; tasks: Array<{ type: string }> };
      expect(typedResult.workflowId).toBe(mockWorkflowId);
      expect(typedResult.status).toBe('PLANNED');
      expect(typedResult.tasks).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException for missing workflow', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(null);

      await expect(service.findById(mockWorkflowId, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for wrong user', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue({
        id: mockWorkflowId,
        userId: 'other-user',
      });

      await expect(service.findById(mockWorkflowId, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should return workflow with tasks and logs', async () => {
      const mockWorkflow = {
        id: mockWorkflowId,
        userId: mockUserId,
        tasks: [],
        logs: [],
      };

      prismaMock.workflow.findUnique.mockResolvedValue(mockWorkflow);

      const result = await service.findById(mockWorkflowId, mockUserId);
      expect(result).toEqual(mockWorkflow);
    });
  });

  describe('cancel', () => {
    it('should throw ForbiddenException for completed workflow', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue({
        id: mockWorkflowId,
        userId: mockUserId,
        status: 'COMPLETED',
      });

      await expect(service.cancel(mockWorkflowId, mockUserId)).rejects.toThrow(ForbiddenException);
    });

    it('should cancel a running workflow', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue({
        id: mockWorkflowId,
        userId: mockUserId,
        status: 'EXECUTING',
      });

      prismaMock.workflowTask.updateMany.mockResolvedValue({ count: 2 });
      prismaMock.workflow.update.mockResolvedValue({ status: 'CANCELLED' });

      const result = await service.cancel(mockWorkflowId, mockUserId);
      expect(result.message).toBe('Workflow cancelled');
    });
  });

  describe('findAll', () => {
    it('should return paginated workflows', async () => {
      const mockWorkflows = [{ id: 'wf-1' }, { id: 'wf-2' }];
      prismaMock.workflow.findMany.mockResolvedValue(mockWorkflows);
      prismaMock.workflow.count.mockResolvedValue(2);

      const result = await service.findAll(mockUserId, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });
  });
});
