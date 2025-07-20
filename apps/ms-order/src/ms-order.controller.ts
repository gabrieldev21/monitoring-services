import { Controller, Get } from '@nestjs/common';
import { MsOrderService } from './ms-order.service';

@Controller()
export class MsOrderController {
  constructor(private readonly msOrderService: MsOrderService) {}

  @Get()
  getHello(): string {
    return this.msOrderService.getHello();
  }
}
