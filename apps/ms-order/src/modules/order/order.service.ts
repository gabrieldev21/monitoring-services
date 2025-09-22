import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import axios from 'axios';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Catalog } from 'apps/ms-catalog/src/modules/catalog/entities/catalog.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    @InjectRepository(Catalog)
    private readonly catalogRepo: Repository<Catalog>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { productIds } = createOrderDto;
    const products = await this.catalogRepo.find({
      where: { id: In(productIds) },
    });
    if (products.length !== productIds.length) {
      this.logger.warn(
        `Alguns produtos não foram encontrados: enviados=${productIds.length}, encontrados=${products.length}`,
      );
    }

    const entity = this.repo.create({ products });
    const saved: Order = await this.repo.save(entity);
    const url = 'http://ms-notification:3003/ms-notification';

    try {
      await axios.post(url, {
        type: 'order_created',
        message: `Pedido ${saved.id} criado com sucesso.`,
      });
    } catch (error) {
      this.logger.warn(
        `Falha ao notificar criação do pedido ${saved.id}: ${error?.message}`,
      );
    }

    return saved;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
