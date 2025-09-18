import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CatalogModule } from './catalog/catalog.module';
import { NotificationModule } from './notification/notification.module';
import { JwtAuthGuard } from 'apps/@shared/infra/jwt-auth.guard';

@Module({
  imports: [AuthModule, OrderModule, CatalogModule, NotificationModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
