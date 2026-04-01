import { IsOptional, IsString, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgentDto {
  @ApiProperty({ example: 'Updated Agent Name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated system prompt', required: false })
  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  tools?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  memoryConfig?: Record<string, any>;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isDeployed?: boolean;
}
