import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('WorkflowController', () => {
  let controller: WorkflowController;
  let serviceMock: {
    triggerWorkflow: jest.Mock;
    executeWorkflow: jest.Mock;
    retryTask: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    cancel: jest.Mock;
  };

  beforeEach(async () => {
    serviceMock = {
      triggerWorkflow: jest.fn(),
      executeWorkflow: jest.fn(),
      retryTask: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      cancel: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        { provide: WorkflowService, useValue: serviceMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WorkflowController>(WorkflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trigger', () => {
    it('should call triggerWorkflow', async () => {
      serviceMock.triggerWorkflow.mockResolvedValue({
        workflowId: 'wf-1',
        status: 'PLANNED',
        tasks: [],
      });

      const result = await controller.trigger('user-1', {
        ticketKey: 'NEXUS-42',
        dryRun: true,
      });

      expect(serviceMock.triggerWorkflow).toHaveBeenCalledWith('user-1', {
        ticketKey: 'NEXUS-42',
        dryRun: true,
      });
      expect(result.workflowId).toBe('wf-1');
    });
  });

  describe('findAll', () => {
    it('should return paginated list', async () => {
      serviceMock.findAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      const result = await controller.findAll('user-1', { page: 1, limit: 20 });

      expect(serviceMock.findAll).toHaveBeenCalledWith('user-1', { page: 1, limit: 20 });
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return workflow details', async () => {
      const mockWorkflow = { id: 'wf-1', userId: 'user-1', tasks: [], logs: [] };
      serviceMock.findById.mockResolvedValue(mockWorkflow);

      const result = await controller.findById('user-1', 'wf-1');

      expect(serviceMock.findById).toHaveBeenCalledWith('wf-1', 'user-1');
      expect(result).toEqual(mockWorkflow);
    });
  });

  describe('execute', () => {
    it('should call executeWorkflow with options', async () => {
      serviceMock.executeWorkflow.mockResolvedValue({
        workflowId: 'wf-1',
        status: 'COMPLETED',
      });

      await controller.execute('user-1', 'wf-1', {
        agentFilter: 'backend',
        writeFiles: true,
      });

      expect(serviceMock.executeWorkflow).toHaveBeenCalledWith('wf-1', 'user-1', {
        agentFilter: 'backend',
        writeFiles: true,
      });
    });
  });

  describe('cancel', () => {
    it('should cancel a workflow', async () => {
      serviceMock.cancel.mockResolvedValue({ message: 'Workflow cancelled', workflowId: 'wf-1' });

      const result = await controller.cancel('user-1', 'wf-1');

      expect(serviceMock.cancel).toHaveBeenCalledWith('wf-1', 'user-1');
      expect(result.message).toBe('Workflow cancelled');
    });
  });
});
