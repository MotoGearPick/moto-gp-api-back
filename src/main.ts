import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Moto Gear Picker API')
    .setDescription('API para selección y gestión de equipamiento de moto')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}/api`);
  console.log(`Swagger docs at    http://localhost:${port}/docs`);
}

bootstrap();
