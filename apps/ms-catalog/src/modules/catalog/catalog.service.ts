import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalog } from './entities/catalog.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private readonly repo: Repository<Catalog>,
  ) {}

  create(createCatalogDto: CreateCatalogDto) {
    const entity = this.repo.create(createCatalogDto as any);
    return this.repo.save(entity);
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
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;
    await this.repo.delete({ id });
    return existing;
  }
}
