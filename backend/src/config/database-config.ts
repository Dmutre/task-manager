import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBType } from 'src/utils/types/db.types';

@Injectable()
export default class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get db_port() {
    return this.configService.get<number>('db.db_port');
  }

  get db_type() {
    return this.configService.get<DBType>('db.db_type');
  }

  get db_host() {
    return this.configService.get<string>('db.db_host');
  }

  get db_password() {
    return this.configService.get<string>('db.db_password');
  }

  get db_name() {
    return this.configService.get<string>('db.db_name');
  }

  get db_user() {
    return this.configService.get<string>('db.db_user');
  }
}
