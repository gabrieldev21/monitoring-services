import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'apps/@shared/infra/typeorm.config';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Catalog } from './entities/catalog.entity';

@Module({
  imports: [TypeOrmConfig, TypeOrmModule.forFeature([Catalog])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
