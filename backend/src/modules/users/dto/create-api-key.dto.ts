import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'Production API Key', description: 'Name for the API key' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
