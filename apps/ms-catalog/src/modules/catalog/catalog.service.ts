import { Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalog } from './entities/catalog.entity';

@Injectable()
export class CatalogService {
  private catalogs: Catalog[] = [];

  create(createCatalogDto: CreateCatalogDto) {
    const newCatalog = { id: Date.now(), ...createCatalogDto };
    this.catalogs.push(newCatalog);
    return newCatalog;
  }

  findAll() {
    return this.catalogs;
  }

  findOne(id: number) {
    return this.catalogs.find((catalog) => catalog.id === id);
  }

  update(id: number, updateCatalogDto: UpdateCatalogDto) {
    const catalogIndex = this.catalogs.findIndex(
      (catalog) => catalog.id === id,
    );
    if (catalogIndex === -1) return null;
    this.catalogs[catalogIndex] = {
      ...this.catalogs[catalogIndex],
      ...updateCatalogDto,
    };

    return this.catalogs[catalogIndex];
  }

  remove(id: number) {
    const catalogIndex = this.catalogs.findIndex(
      (catalog) => catalog.id === id,
    );
    if (catalogIndex === -1) return null;
    const removed = this.catalogs.splice(catalogIndex, 1);
    return removed[0];
  }
}
