import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCatalogDto } from 'apps/@shared/DTO/catalog/create-catalog.dto';
import { UpdateCatalogDto } from 'apps/@shared/DTO/catalog/update-catalog.dto';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  create(@Body() createCatalogDto: CreateCatalogDto) {
    return this.catalogService.create(createCatalogDto);
  }

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogDto: UpdateCatalogDto) {
    return this.catalogService.update(+id, updateCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogService.remove(+id);
  }
}
