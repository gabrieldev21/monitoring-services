import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CatalogModule } from './catalog/catalog.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, OrderModule, CatalogModule, NotificationModule],
})
export class AppModule {}
