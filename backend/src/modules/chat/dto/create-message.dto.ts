import { IsNotEmpty, IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageRole } from '@prisma/client';

export class CreateMessageDto {
  @ApiProperty({ example: 'USER', enum: MessageRole })
  @IsEnum(MessageRole)
  @IsNotEmpty()
  role: MessageRole;

  @ApiProperty({ example: 'What is the capital of France?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: { images: ['url1', 'url2'] },
    required: false,
    description: 'Optional attachments',
  })
  @IsObject()
  @IsOptional()
  attachments?: Record<string, any>;
}
