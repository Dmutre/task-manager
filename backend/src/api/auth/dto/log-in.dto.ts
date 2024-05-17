import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogInDTO {
  @ApiProperty({ description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
