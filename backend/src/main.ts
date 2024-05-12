import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();

  const PORT = configService.get<number>('port');

  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => {
    console.log('Server started on PORT: ' + PORT);
  });
}
bootstrap();
