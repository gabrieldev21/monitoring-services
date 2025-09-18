import '../../@shared/infra/otel-sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { OtelLogger } from '../../@shared/infra/otel-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new OtelLogger(['error', 'warn', 'log']));
  app
    .getHttpAdapter()
    .getInstance()
    .get('/health', (_req, res) => {
      res.json({ ok: true });
    });
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
