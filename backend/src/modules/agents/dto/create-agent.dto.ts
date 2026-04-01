import { IsNotEmpty, IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'Customer Support Agent', description: 'Agent name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'You are a helpful customer support agent. Be polite and professional.',
    description: 'System prompt for the agent',
  })
  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @ApiProperty({
    example: [
      {
        name: 'search_knowledge_base',
        description: 'Search the knowledge base',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      },
    ],
    required: false,
    description: 'Tools available to the agent',
  })
  @IsObject()
  @IsOptional()
  tools?: Record<string, any>;

  @ApiProperty({
    example: { shortTerm: true, longTerm: false, maxTokens: 4000 },
    required: false,
    description: 'Memory configuration',
  })
  @IsObject()
  @IsOptional()
  memoryConfig?: Record<string, any>;

  @ApiProperty({ example: 'support-template', required: false, description: 'Template ID' })
  @IsString()
  @IsOptional()
  templateId?: string;
}
