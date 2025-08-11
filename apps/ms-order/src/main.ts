import tracing from '../../infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { OrderModule } from './modules/order/order.module';

async function bootstrap() {
  tracing.start();

  const app = await NestFactory.create(OrderModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
