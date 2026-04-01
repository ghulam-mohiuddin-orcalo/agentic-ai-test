import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackUsageDto, UsageStatsDto } from './dto';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async track(userId: string, dto: TrackUsageDto) {
    const totalTokens = dto.promptTokens + dto.completionTokens;

    return this.prisma.usage.create({
      data: {
        userId,
        modelId: dto.modelId,
        promptTokens: dto.promptTokens,
        completionTokens: dto.completionTokens,
        totalTokens,
        cost: dto.cost,
      },
    });
  }

  async getStats(userId: string, query: UsageStatsDto) {
    const { startDate, endDate, modelId } = query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    if (modelId) where.modelId = modelId;

    const [usage, totalCost, totalTokens] = await Promise.all([
      this.prisma.usage.findMany({
        where,
        include: {
          model: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
      }),
      this.prisma.usage.aggregate({
        where,
        _sum: { cost: true },
      }),
      this.prisma.usage.aggregate({
        where,
        _sum: {
          promptTokens: true,
          completionTokens: true,
          totalTokens: true,
        },
      }),
    ]);

    return {
      usage,
      summary: {
        totalCost: totalCost._sum.cost || 0,
        totalTokens: totalTokens._sum.totalTokens || 0,
        promptTokens: totalTokens._sum.promptTokens || 0,
        completionTokens: totalTokens._sum.completionTokens || 0,
      },
    };
  }

  async getByModel(userId: string, query: UsageStatsDto) {
    const { startDate, endDate } = query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const usage = await this.prisma.usage.groupBy({
      by: ['modelId'],
      where,
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        cost: true,
      },
      _count: true,
    });

    // Get model details
    const modelIds = usage.map((u) => u.modelId);
    const models = await this.prisma.model.findMany({
      where: { id: { in: modelIds } },
      select: { id: true, name: true, provider: true },
    });

    const modelMap = new Map(models.map((m) => [m.id, m]));

    return usage.map((u) => ({
      model: modelMap.get(u.modelId),
      requests: u._count,
      totalTokens: u._sum.totalTokens || 0,
      promptTokens: u._sum.promptTokens || 0,
      completionTokens: u._sum.completionTokens || 0,
      totalCost: u._sum.cost || 0,
    }));
  }

  async getHistory(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.usage.findMany({
        where: { userId },
        include: {
          model: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.usage.count({ where: { userId } }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}
