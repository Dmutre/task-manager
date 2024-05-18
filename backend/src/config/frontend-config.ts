import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class FrontendConfiguration {
  constructor(private readonly configService: ConfigService) {}

  get url() {
    return this.configService.get<string>('frontend.url');
  }
}
