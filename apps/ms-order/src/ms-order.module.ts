import { Module } from '@nestjs/common';
import { MsOrderController } from './ms-order.controller';
import { MsOrderService } from './ms-order.service';

@Module({
  imports: [],
  controllers: [MsOrderController],
  providers: [MsOrderService],
})
export class MsOrderModule {}
