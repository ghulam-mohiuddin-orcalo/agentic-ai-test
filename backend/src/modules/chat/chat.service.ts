import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConversationDto, CreateMessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(userId: string, dto: CreateConversationDto) {
    // Verify model exists
    const model = await this.prisma.model.findUnique({
      where: { id: dto.modelId },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return this.prisma.conversation.create({
      data: {
        userId,
        modelId: dto.modelId,
        title: dto.title,
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            provider: true,
          },
        },
      },
    });
  }

  async getConversations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where: { userId },
        include: {
          model: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
          messages: {
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: { select: { messages: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.conversation.count({ where: { userId } }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            provider: true,
            contextWindow: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { message: 'Conversation deleted successfully' };
  }

  async createMessage(userId: string, conversationId: string, dto: CreateMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        role: dto.role,
        content: dto.content,
        attachments: dto.attachments,
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}
