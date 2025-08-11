import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  private orders: any[] = [];

  create(createOrderDto: CreateOrderDto) {
    const newOrder = { id: this.orders.length + 1, ...createOrderDto };
    this.orders.push(newOrder);
    return newOrder;
  }

  findAll() {
    return this.orders;
  }

  findOne(id: number) {
    return this.orders.find((order) => order.id === id);
  }
}
