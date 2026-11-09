import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend PWA
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,x-couple-id',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Static files for uploaded images
  const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
  app.use('/uploads', express.static(uploadDir));

  // Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Digital Scrapbook & Receipt Jar API')
    .setDescription(
      'Private couple scrapbooking & receipt jar backend with multi-tenant architecture and "On This Day" flashback engine.',
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-couple-id',
        in: 'header',
        description: 'Couple UUID tenant identifier',
      },
      'x-couple-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Scrapbook Backend running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
