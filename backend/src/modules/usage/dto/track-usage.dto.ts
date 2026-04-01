import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackUsageDto {
  @ApiProperty({ example: 'cmnfrjouf0002m7wtt8xkk49b', description: 'Model ID' })
  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ApiProperty({ example: 1500, description: 'Prompt tokens used' })
  @IsNumber()
  @Min(0)
  promptTokens: number;

  @ApiProperty({ example: 500, description: 'Completion tokens used' })
  @IsNumber()
  @Min(0)
  completionTokens: number;

  @ApiProperty({ example: 0.05, description: 'Cost in USD' })
  @IsNumber()
  @Min(0)
  cost: number;
}
