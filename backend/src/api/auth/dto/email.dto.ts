import { ApiProperty } from '@nestjs/swagger';

export class EmailDTO {
  @ApiProperty({ description: 'User email' })
  email: string;
}
