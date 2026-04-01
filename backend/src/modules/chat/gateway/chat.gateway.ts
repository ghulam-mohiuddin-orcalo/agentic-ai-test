import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { ChatDto } from '../dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleChat(@MessageBody() data: ChatDto, @ConnectedSocket() client: Socket) {
    try {
      // Simulate streaming response (replace with actual AI provider integration)
      const response = `This is a simulated response for: "${data.messages[data.messages.length - 1].content}". Model: ${data.modelId}`;

      // Simulate streaming by sending chunks
      const words = response.split(' ');
      for (const word of words) {
        client.emit('chat:chunk', { delta: word + ' ' });
        await this.delay(50); // Simulate streaming delay
      }

      // Save messages to database if conversationId provided
      if (data.conversationId) {
        const userMessage = data.messages[data.messages.length - 1];
        await this.chatService.createMessage(
          client.handshake.auth.userId,
          data.conversationId,
          {
            role: 'USER',
            content: userMessage.content,
          },
        );

        await this.chatService.createMessage(
          client.handshake.auth.userId,
          data.conversationId,
          {
            role: 'ASSISTANT',
            content: response,
          },
        );
      }

      client.emit('chat:done', {
        success: true,
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      });
    } catch (error) {
      client.emit('chat:error', { message: error.message });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
