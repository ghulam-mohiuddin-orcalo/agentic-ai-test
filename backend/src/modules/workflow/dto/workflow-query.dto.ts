import { IsOptional, IsInt, Min, Max, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WorkflowQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: ['PENDING', 'ANALYZING', 'PLANNED', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  @IsEnum(['PENDING', 'ANALYZING', 'PLANNED', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by JIRA ticket key' })
  @IsString()
  @IsOptional()
  ticketKey?: string;
}
