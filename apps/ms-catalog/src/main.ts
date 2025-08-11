import tracing from '../../infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { MsCatalogModule } from './ms-catalog.module';

async function bootstrap() {
  tracing.start();

  const app = await NestFactory.create(MsCatalogModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
