import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Rating from 1 to 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Excellent model for complex reasoning tasks!',
    required: false,
    description: 'Optional review comment',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
