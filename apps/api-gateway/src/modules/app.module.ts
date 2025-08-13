import { Module } from '@nestjs/common';
import { MetricModule } from './metric/metric.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [MetricModule, AuthModule, OrderModule, CatalogModule],
})
export class AppModule {}
