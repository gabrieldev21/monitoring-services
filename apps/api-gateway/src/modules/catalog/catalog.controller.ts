import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import axios from 'axios';

@Controller('catalog')
export class CatalogController {
  private readonly catalogServiceUrl = 'http://localhost:3003/catalog';

  @Post()
  async create(@Body() createCatalogDto: any) {
    const response = await axios.post(this.catalogServiceUrl, createCatalogDto);
    return response.data;
  }

  @Get()
  async findAll() {
    const response = await axios.get(this.catalogServiceUrl);
    return response.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await axios.get(`${this.catalogServiceUrl}/${id}`);
    return response.data;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCatalogDto: any) {
    const response = await axios.patch(
      `${this.catalogServiceUrl}/${id}`,
      updateCatalogDto,
    );
    return response.data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await axios.delete(`${this.catalogServiceUrl}/${id}`);
    return response.data;
  }
}
