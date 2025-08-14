import tracing from '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './modules/catalog/catalog.module';

async function bootstrap() {
  tracing.start();

  const app = await NestFactory.create(CatalogModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
