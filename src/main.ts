import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // BUG-1: ValidationPipe is NOT globally registered
  // This means class-validator decorators in DTOs have no effect
  // A QA must discover that invalid payloads are accepted

  const config = new DocumentBuilder()
    .setTitle('QA Practice API')
    .setDescription('Task Management System — API reference for QA testing')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application running on port ${process.env.PORT || 3000}`);
  console.log(`Swagger docs: http://localhost:${process.env.PORT || 3000}/api-docs`);
}
void bootstrap();
