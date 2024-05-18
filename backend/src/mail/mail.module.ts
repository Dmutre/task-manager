import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import ConfigurationModule from 'src/config/configuration.module';
import SMTPConfiguration from 'src/config/smtp-config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [SMTPConfiguration],
      useFactory: (configService: SMTPConfiguration) => ({
        transport: {
          host: configService.host,
          secure: false,
          auth: {
            user: configService.username,
            pass: configService.password,
          },
        },
        defaults: {
          from: 'Approve your email <noreply@spdload-task.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
