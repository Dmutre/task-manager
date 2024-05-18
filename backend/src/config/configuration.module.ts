import { Module } from '@nestjs/common';
import DatabaseConfigService from './database-config';
import JwtConfiguration from './jwt-config';
import SMTPConfiguration from './smtp-config';
import FrontendConfiguration from './frontend-config';

@Module({
  providers: [
    DatabaseConfigService,
    JwtConfiguration,
    SMTPConfiguration,
    FrontendConfiguration,
  ],
  exports: [
    DatabaseConfigService,
    JwtConfiguration,
    SMTPConfiguration,
    FrontendConfiguration,
  ],
})
export default class ConfigurationModule {}
