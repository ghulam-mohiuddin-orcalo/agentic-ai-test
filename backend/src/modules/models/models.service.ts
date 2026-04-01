import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterModelsDto, CreateModelDto, CreateReviewDto } from './dto';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FilterModelsDto) {
    const { search, provider, status, minRating, tag, license, sortBy, order, page, limit } =
      query;
    const skip = (page - 1) * limit;

    const where: Prisma.ModelWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (provider) where.provider = provider;
    if (status) where.status = status;
    if (minRating) where.rating = { gte: minRating };
    if (tag) where.tags = { has: tag };
    if (license) where.license = license;

    const orderBy: Prisma.ModelOrderByWithRelationInput = {};
    if (sortBy) {
      orderBy[sortBy] = order || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.model.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          provider: true,
          description: true,
          contextWindow: true,
          pricing: true,
          rating: true,
          tags: true,
          license: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.model.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const model = await this.prisma.model.findUnique({
      where: { id },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, conversations: true } },
      },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }

  async create(dto: CreateModelDto) {
    return this.prisma.model.create({
      data: {
        ...dto,
        tags: dto.tags || [],
      },
    });
  }

  async update(id: string, dto: Partial<CreateModelDto>) {
    await this.findById(id);

    return this.prisma.model.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.model.delete({ where: { id } });

    return { message: 'Model deleted successfully' };
  }

  // --- Reviews ---

  async createReview(modelId: string, userId: string, dto: CreateReviewDto) {
    await this.findById(modelId);

    const existing = await this.prisma.review.findUnique({
      where: { modelId_userId: { modelId, userId } },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this model');
    }

    const review = await this.prisma.review.create({
      data: { modelId, userId, ...dto },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });

    // Update model average rating
    const { _avg } = await this.prisma.review.aggregate({
      where: { modelId },
      _avg: { rating: true },
    });

    await this.prisma.model.update({
      where: { id: modelId },
      data: { rating: _avg.rating || 0 },
    });

    return review;
  }

  async getReviews(modelId: string, page = 1, limit = 20) {
    await this.findById(modelId);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { modelId },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { modelId } }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getProviders() {
    const providers = await this.prisma.model.findMany({
      select: { provider: true },
      distinct: ['provider'],
      orderBy: { provider: 'asc' },
    });

    return providers.map((p) => p.provider);
  }

  async getTags() {
    const models = await this.prisma.model.findMany({
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    models.forEach((m) => m.tags.forEach((t) => tagSet.add(t)));

    return Array.from(tagSet).sort();
  }
}
