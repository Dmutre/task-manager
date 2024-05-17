import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDTO {
  @ApiProperty({ description: 'Token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
