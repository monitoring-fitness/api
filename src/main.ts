import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 开启DTO验证
  app.enableCors();
  app.setViewEngine('hbs');

  app.listen(9000, '0.0.0.0', () => {
    console.log(`Server start on http://0.0.0.0:9000`);
  });
}
bootstrap();
