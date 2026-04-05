import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TriggerWorkflowDto {
  @ApiProperty({ example: 'NEXUS-42', description: 'JIRA ticket key' })
  @IsString()
  @IsNotEmpty()
  ticketKey: string;

  @ApiPropertyOptional({ default: true, description: 'If true, only plan without executing' })
  @IsBoolean()
  @IsOptional()
  dryRun?: boolean;

  @ApiPropertyOptional({ enum: ['backend', 'frontend'], description: 'Filter to a single agent type' })
  @IsEnum(['backend', 'frontend'])
  @IsOptional()
  agentFilter?: 'backend' | 'frontend';
}
