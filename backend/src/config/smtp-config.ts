import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class SMTPConfiguration {
  constructor(private readonly configService: ConfigService) {}

  get host() {
    return this.configService.get<string>('smtp.host');
  }

  get password() {
    return this.configService.get<string>('smtp.password');
  }

  get username() {
    return this.configService.get<string>('smtp.username');
  }
}
