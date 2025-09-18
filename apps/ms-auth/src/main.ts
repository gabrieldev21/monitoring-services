import '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(3001);
}
bootstrap();
