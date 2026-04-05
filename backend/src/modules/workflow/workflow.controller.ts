import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { TriggerWorkflowDto, WorkflowQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Workflow')
@ApiBearerAuth()
@Controller('workflow')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger a workflow for a JIRA ticket' })
  async trigger(
    @CurrentUser('id') userId: string,
    @Body() dto: TriggerWorkflowDto,
  ) {
    return this.workflowService.triggerWorkflow(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all workflows' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: WorkflowQueryDto,
  ) {
    return this.workflowService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow details with tasks and logs' })
  async findById(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.workflowService.findById(id, userId);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a planned workflow' })
  async execute(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body?: { agentFilter?: 'backend' | 'frontend'; writeFiles?: boolean },
  ) {
    return this.workflowService.executeWorkflow(id, userId, {
      agentFilter: body?.agentFilter,
      writeFiles: body?.writeFiles,
    });
  }

  @Post(':id/tasks/:taskId/retry')
  @ApiOperation({ summary: 'Retry a failed task' })
  async retryTask(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Param('taskId') taskId: string,
  ) {
    return this.workflowService.retryTask(id, taskId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a running workflow' })
  async cancel(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.workflowService.cancel(id, userId);
  }
}
