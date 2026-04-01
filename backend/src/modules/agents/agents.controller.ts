import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto, TestAgentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Agents')
@ApiBearerAuth()
@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get agent templates' })
  async getTemplates() {
    return this.agentsService.getTemplates();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateAgentDto) {
    return this.agentsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all agents' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.agentsService.findAll(userId, page || 1, limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  async findById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.agentsService.findById(userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an agent' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agent' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.agentsService.delete(userId, id);
  }

  @Post(':id/deploy')
  @ApiOperation({ summary: 'Deploy an agent' })
  async deploy(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.agentsService.deploy(userId, id);
  }

  @Post(':id/undeploy')
  @ApiOperation({ summary: 'Undeploy an agent' })
  async undeploy(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.agentsService.undeploy(userId, id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test an agent' })
  async test(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: TestAgentDto,
  ) {
    return this.agentsService.test(userId, id, dto);
  }
}
