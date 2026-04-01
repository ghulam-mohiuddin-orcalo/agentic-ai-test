import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'cmnfrjouf0002m7wtt8xkk49b', description: 'Model ID to use' })
  @IsString()
  @IsNotEmpty()
  modelId: string;

  @ApiProperty({ example: 'My first conversation', required: false })
  @IsString()
  @IsOptional()
  title?: string;
}
