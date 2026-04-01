import { IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestAgentDto {
  @ApiProperty({
    example: [
      { role: 'user', content: 'Hello, I need help with my order' },
    ],
    description: 'Test messages',
  })
  @IsArray()
  @IsNotEmpty()
  messages: Array<{ role: string; content: string }>;
}
