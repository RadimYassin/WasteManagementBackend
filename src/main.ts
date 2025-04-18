import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const uploadDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  const app = await NestFactory.create(AppModule);

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Report API')
    .setDescription('API documentation for report management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors({
    origin: '*', // OR replace with specific origin: ['http://localhost:8081']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
 
}
bootstrap();
