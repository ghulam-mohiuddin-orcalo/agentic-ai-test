import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsageStatsDto {
  @ApiProperty({ example: '2026-03-01', required: false, description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2026-04-01', required: false, description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'cmnfrjouf0002m7wtt8xkk49b', required: false, description: 'Filter by model ID' })
  @IsString()
  @IsOptional()
  modelId?: string;

  @ApiProperty({ example: 'day', enum: ['day', 'week', 'month'], required: false, description: 'Grouping period' })
  @IsString()
  @IsOptional()
  groupBy?: 'day' | 'week' | 'month';
}
