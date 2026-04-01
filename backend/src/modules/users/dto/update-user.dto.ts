import { IsOptional, IsString, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe Updated', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: { theme: 'dark', language: 'en', notifications: true },
    required: false,
    description: 'User preferences as JSON object',
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
}
