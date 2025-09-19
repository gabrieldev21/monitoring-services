import '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './modules/notification/notification.module';
import { OtelLogger } from 'apps/@shared/infra/otel-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.useLogger(new OtelLogger(['error', 'warn', 'log']));
  await app.listen(3004);
}
bootstrap();
