import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModelStatus } from '@prisma/client';

export class CreateModelDto {
  @ApiProperty({ example: 'GPT-4 Turbo', description: 'Model name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'openai', description: 'Provider name' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    example: 'Most capable GPT model for complex tasks',
    description: 'Model description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 128000, description: 'Context window size in tokens' })
  @IsNumber()
  contextWindow: number;

  @ApiProperty({
    example: { input: 2.5, output: 10 },
    description: 'Pricing per 1M tokens',
  })
  @IsObject()
  pricing: { input: number; output: number };

  @ApiProperty({
    example: ['chat', 'code', 'reasoning'],
    required: false,
    description: 'Model tags',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'proprietary', required: false, description: 'License type' })
  @IsString()
  @IsOptional()
  license?: string;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ModelStatus,
    required: false,
    description: 'Model status',
  })
  @IsEnum(ModelStatus)
  @IsOptional()
  status?: ModelStatus;
}
