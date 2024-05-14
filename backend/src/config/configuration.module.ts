import { Module } from '@nestjs/common';
import DatabaseConfigService from './database-config';

@Module({
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export default class ConfigurationModule {}
