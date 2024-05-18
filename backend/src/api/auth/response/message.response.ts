import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({ description: 'Message of success of operation' })
  message: string;
}
