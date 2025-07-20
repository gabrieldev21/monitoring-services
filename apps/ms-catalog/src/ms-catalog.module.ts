import { Module } from '@nestjs/common';
import { MsCatalogController } from './ms-catalog.controller';
import { MsCatalogService } from './ms-catalog.service';

@Module({
  imports: [],
  controllers: [MsCatalogController],
  providers: [MsCatalogService],
})
export class MsCatalogModule {}
