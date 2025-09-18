import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogDto } from '../../../../@shared/DTO/catalog/create-catalog.dto';
import { UpdateCatalogDto } from '../../../../@shared/DTO/catalog/update-catalog.dto';
import { Catalog } from './entities/catalog.entity';
import axios from 'axios';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  constructor(
    @InjectRepository(Catalog)
    private readonly repo: Repository<Catalog>,
  ) {}

  async create(createCatalogDto: CreateCatalogDto) {
    const entity = this.repo.create(createCatalogDto);
    const saved = await this.repo.save(entity);
    const url = 'http://api-gateway:3000/notification';

    try {
      await axios.post(url, {
        type: 'catalog_created',
        message: `Catalogo ${saved.id} criado/atualizado.`,
      });
      this.logger.log(
        `Notificação enviada para ms-notification sobre catálogo ${saved.id}`,
      );

      return saved;
    } catch (err: any) {
      this.logger.warn(
        `Falha ao notificar criação de catálogo ${saved.id}: ${err?.message}`,
      );
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto) {
    await this.repo.update({ id }, updateCatalogDto as any);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const existing = await this.repo.findOne({
      where: { id },
    });

    if (!existing) return null;

    await this.repo.delete({ id });

    return existing;
  }
}
