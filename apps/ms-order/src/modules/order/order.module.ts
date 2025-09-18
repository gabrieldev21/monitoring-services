import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'apps/@shared/infra/typeorm.config';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { Catalog } from 'apps/ms-catalog/src/modules/catalog/entities/catalog.entity';

@Module({
  imports: [TypeOrmConfig, TypeOrmModule.forFeature([Order, Catalog])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
