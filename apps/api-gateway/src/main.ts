import tracing from '../../infra/tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  tracing.start();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
