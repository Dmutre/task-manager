import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailDTO {
  @ApiProperty({ description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;
}
