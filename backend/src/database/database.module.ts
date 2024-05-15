import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigurationModule from 'src/config/configuration.module';
import DatabaseConfigService from 'src/config/database-config';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [DatabaseConfigService],
      useFactory: (configService: DatabaseConfigService) => ({
        type: configService.db_type,
        host: configService.db_host,
        port: configService.db_port,
        username: configService.db_user,
        password: configService.db_password,
        database: configService.db_name,
        entities: [User, Task],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
