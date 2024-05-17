import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class JwtConfiguration {
  constructor(private readonly configService: ConfigService) {}

  get jwt_secret() {
    return this.configService.get<string>('jwt.jwt_secret');
  }

  get jwt_refresh_ttl() {
    return this.configService.get<string>('jwt.jwt_refresh_ttl');
  }
}
