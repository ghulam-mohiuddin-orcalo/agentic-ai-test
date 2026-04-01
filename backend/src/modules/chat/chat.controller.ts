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
import { ChatService } from './chat.service';
import { CreateConversationDto, CreateMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(userId, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations' })
  async getConversations(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getConversations(userId, page || 1, limit || 20);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation with messages' })
  async getConversation(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.chatService.getConversation(userId, id);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  async deleteConversation(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.chatService.deleteConversation(userId, id);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Add a message to conversation' })
  async createMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(userId, conversationId, dto);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages from conversation' })
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(userId, conversationId, page || 1, limit || 50);
  }
}
