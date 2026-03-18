import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // BUG-1: ValidationPipe is NOT globally registered
  // This means class-validator decorators in DTOs have no effect
  // A QA must discover that invalid payloads are accepted
  await app.listen(process.env.PORT || 3000);
  console.log(`Application running on port ${process.env.PORT || 3000}`);
}
bootstrap();
