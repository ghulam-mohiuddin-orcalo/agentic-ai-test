import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ModelStatus } from '@prisma/client';

export class FilterModelsDto {
  @ApiProperty({ example: 'gpt', required: false, description: 'Search in name/description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 'openai', required: false, description: 'Filter by provider' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ModelStatus,
    required: false,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(ModelStatus)
  status?: ModelStatus;

  @ApiProperty({ example: 4, required: false, description: 'Minimum rating (0-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiProperty({ example: 'chat', required: false, description: 'Filter by tag' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({ example: 'proprietary', required: false, description: 'Filter by license' })
  @IsOptional()
  @IsString()
  license?: string;

  @ApiProperty({
    example: 'rating',
    enum: ['rating', 'name', 'createdAt'],
    required: false,
    description: 'Sort by field',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'rating' | 'name' | 'createdAt';

  @ApiProperty({
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
    description: 'Sort order',
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiProperty({ example: 1, required: false, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, description: 'Items per page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
