import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const swagger = new DocumentBuilder()
  .setTitle("E-Shop")
  .setVersion("1.0")
  .setDescription("E-Shop API")
  .addTag("E-Shop")
  
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app,swagger);
  SwaggerModule.setup('api',app,document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
