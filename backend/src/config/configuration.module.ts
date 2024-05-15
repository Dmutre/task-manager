import { Module } from '@nestjs/common';
import DatabaseConfigService from './database-config';
import JwtConfiguration from './jwt-config';

@Module({
  providers: [DatabaseConfigService, JwtConfiguration],
  exports: [DatabaseConfigService, JwtConfiguration],
})
export default class ConfigurationModule {}
