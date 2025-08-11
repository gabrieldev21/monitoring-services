import tracing from '../../infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './modules/notification/notification.module';

async function bootstrap() {
  tracing.start();

  const app = await NestFactory.create(NotificationModule);
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
