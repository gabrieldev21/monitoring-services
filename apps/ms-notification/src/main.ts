import { NestFactory } from '@nestjs/core';
import { MsNotificationModule } from './ms-notification.module';

async function bootstrap() {
  const app = await NestFactory.create(MsNotificationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
