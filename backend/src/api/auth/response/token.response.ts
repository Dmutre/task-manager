import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    description: 'Access token, that user can use for authorization',
  })
  access_token: string;
}
