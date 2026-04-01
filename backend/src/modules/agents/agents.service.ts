import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto, TestAgentDto } from './dto';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAgentDto) {
    return this.prisma.agent.create({
      data: {
        userId,
        name: dto.name,
        systemPrompt: dto.systemPrompt,
        tools: dto.tools,
        memoryConfig: dto.memoryConfig,
        templateId: dto.templateId,
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.agent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.agent.count({ where: { userId } }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findById(userId: string, agentId: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent || agent.userId !== userId) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async update(userId: string, agentId: string, dto: UpdateAgentDto) {
    await this.findById(userId, agentId);

    return this.prisma.agent.update({
      where: { id: agentId },
      data: dto,
    });
  }

  async delete(userId: string, agentId: string) {
    await this.findById(userId, agentId);

    await this.prisma.agent.delete({
      where: { id: agentId },
    });

    return { message: 'Agent deleted successfully' };
  }

  async deploy(userId: string, agentId: string) {
    const agent = await this.findById(userId, agentId);

    if (agent.isDeployed) {
      throw new ConflictException('Agent is already deployed');
    }

    // Generate unique endpoint
    const endpoint = `agent-${randomBytes(8).toString('hex')}`;

    return this.prisma.agent.update({
      where: { id: agentId },
      data: {
        isDeployed: true,
        endpoint,
      },
    });
  }

  async undeploy(userId: string, agentId: string) {
    const agent = await this.findById(userId, agentId);

    if (!agent.isDeployed) {
      throw new ConflictException('Agent is not deployed');
    }

    return this.prisma.agent.update({
      where: { id: agentId },
      data: {
        isDeployed: false,
        endpoint: null,
      },
    });
  }

  async test(userId: string, agentId: string, dto: TestAgentDto) {
    const agent = await this.findById(userId, agentId);

    // Simulate agent response (replace with actual AI integration)
    const response = {
      agentId: agent.id,
      agentName: agent.name,
      systemPrompt: agent.systemPrompt,
      input: dto.messages,
      output: {
        role: 'assistant',
        content: `This is a simulated response from ${agent.name}. In production, this would use the configured system prompt and tools.`,
      },
      toolsUsed: [],
      timestamp: new Date().toISOString(),
    };

    return response;
  }

  async getTemplates() {
    // Predefined agent templates
    return [
      {
        id: 'support-template',
        name: 'Customer Support',
        description: 'Helpful customer support agent',
        systemPrompt:
          'You are a helpful customer support agent. Be polite, professional, and solve customer issues efficiently.',
        tools: [
          {
            name: 'search_knowledge_base',
            description: 'Search the knowledge base for answers',
            parameters: {
              type: 'object',
              properties: {
                query: { type: 'string' },
              },
              required: ['query'],
            },
          },
        ],
      },
      {
        id: 'research-template',
        name: 'Research Assistant',
        description: 'Research and analysis agent',
        systemPrompt:
          'You are a research assistant. Provide detailed, well-researched answers with citations.',
        tools: [
          {
            name: 'web_search',
            description: 'Search the web for information',
            parameters: {
              type: 'object',
              properties: {
                query: { type: 'string' },
              },
              required: ['query'],
            },
          },
        ],
      },
      {
        id: 'code-template',
        name: 'Code Review',
        description: 'Code review and analysis agent',
        systemPrompt:
          'You are a code review expert. Analyze code for bugs, performance issues, and best practices.',
        tools: [],
      },
      {
        id: 'data-template',
        name: 'Data Analysis',
        description: 'Data analysis and visualization agent',
        systemPrompt:
          'You are a data analyst. Help users understand their data through analysis and visualization.',
        tools: [
          {
            name: 'query_database',
            description: 'Query the database',
            parameters: {
              type: 'object',
              properties: {
                sql: { type: 'string' },
              },
              required: ['sql'],
            },
          },
        ],
      },
      {
        id: 'content-template',
        name: 'Content Writer',
        description: 'Content creation agent',
        systemPrompt:
          'You are a professional content writer. Create engaging, well-structured content.',
        tools: [],
      },
    ];
  }
}
