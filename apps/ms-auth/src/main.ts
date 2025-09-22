import '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { OtelLogger } from 'apps/@shared/infra/otel-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.getHttpAdapter().getInstance().keepAliveTimeout = 60000;
  app.getHttpAdapter().getInstance().headersTimeout = 65000;
  app.useLogger(new OtelLogger(['error', 'warn', 'log']));
  await app.listen(3001);
}
bootstrap();
