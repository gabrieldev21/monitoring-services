import '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OtelLogger } from 'apps/@shared/infra/otel-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);
  app.useLogger(new OtelLogger(['error', 'warn', 'log']));
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
