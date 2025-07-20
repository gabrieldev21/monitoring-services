import { NestFactory } from '@nestjs/core';
import { MsOrderModule } from './ms-order.module';

async function bootstrap() {
  const app = await NestFactory.create(MsOrderModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
