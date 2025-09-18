import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const entity = this.repo.create(createOrderDto);
    const saved: Order = await this.repo.save(entity);
    const url = 'http://ms-notification:3004/notification';

    try {
      await axios.post(url, {
        type: 'order_created',
        message: `Pedido ${saved.id} criado com sucesso.`,
      });
      return saved;
    } catch (error) {
      this.logger.warn(
        `Falha ao notificar criação do pedido ${saved.id}: ${error?.message}`,
      );
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
