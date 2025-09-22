import '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { OrderModule } from './modules/order/order.module';
import { OtelLogger } from 'apps/@shared/infra/otel-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.getHttpAdapter().getInstance().keepAliveTimeout = 60000;
  app.getHttpAdapter().getInstance().headersTimeout = 65000;
  app.useLogger(new OtelLogger(['error', 'warn', 'log']));
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
