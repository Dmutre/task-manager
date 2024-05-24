import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { JwtGuard } from 'src/security/jwt.guard';
import { JwtStrategy } from 'src/security/JwtStrategy';
import { LocalAuthGuard } from 'src/security/local.guard';
import { LocalStrategy } from 'src/security/LocalStrategy';
import { JwtModule } from '@nestjs/jwt';
import ConfigurationModule from 'src/config/configuration.module';
import JwtConfiguration from 'src/config/jwt-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Token } from 'src/database/entities/token.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    ConfigurationModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [JwtConfiguration],
      useFactory: (configservice: JwtConfiguration) => ({
        global: true,
        secret: configservice.jwt_secret,
        signOptions: { expiresIn: configservice.jwt_refresh_ttl },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtGuard,
  ],
})
export default class AuthModule {}
