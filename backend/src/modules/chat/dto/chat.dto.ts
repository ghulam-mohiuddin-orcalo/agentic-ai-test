import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ example: 'cmnfrjouf0002m7wtt8xkk49b', description: 'Model ID' })
  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ApiProperty({
    example: [
      { role: 'user', content: 'What is the capital of France?' },
      { role: 'assistant', content: 'The capital of France is Paris.' },
      { role: 'user', content: 'What is its population?' },
    ],
    description: 'Conversation messages',
  })
  @IsArray()
  @IsNotEmpty()
  messages: Array<{ role: string; content: string }>;

  @ApiProperty({ required: false, description: 'Conversation ID for history' })
  @IsString()
  @IsOptional()
  conversationId?: string;
}
