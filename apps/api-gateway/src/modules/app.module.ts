import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricModule } from './metric/metric.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CatalogModule } from './catalog/catalog.module';
import { NotificationModule } from './notification/notification.module';
import { Auth } from 'apps/ms-auth/src/modules/auth/entities/auth.entity';
import { Order } from 'apps/ms-order/src/modules/order/entities/order.entity';
import { Catalog } from 'apps/ms-catalog/src/modules/catalog/entities/catalog.entity';
import { Notification } from 'apps/ms-notification/src/modules/notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'tccdb',
      entities: [Auth, Order, Catalog, Notification],
      synchronize: true,
    }),
    MetricModule,
    AuthModule,
    OrderModule,
    CatalogModule,
    NotificationModule,
  ],
})
export class AppModule {}
