import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import httpClient from 'apps/@shared/infra/http/http-client';
import { CreateCatalogDto } from 'apps/@shared/DTO/catalog/create-catalog.dto';

@Controller('catalog')
export class CatalogController {
  private readonly catalogServiceUrl = 'http://ms-catalog:3002/ms-catalog';

  @Post()
  async create(
    @Body() createCatalogDto: CreateCatalogDto,
    @Headers('authorization') auth?: string,
  ) {
    const response = await httpClient.post(
      this.catalogServiceUrl,
      createCatalogDto,
      {
        headers: auth ? { Authorization: auth } : undefined,
      },
    );
    return response.data;
  }

  @Get()
  async findAll(@Headers('authorization') auth?: string) {
    const response = await httpClient.get(this.catalogServiceUrl, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') auth?: string,
  ) {
    const response = await httpClient.get(`${this.catalogServiceUrl}/${id}`, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatalogDto: any,
    @Headers('authorization') auth?: string,
  ) {
    const response = await httpClient.patch(
      `${this.catalogServiceUrl}/${id}`,
      updateCatalogDto,
      { headers: auth ? { Authorization: auth } : undefined },
    );
    return response.data;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') auth?: string,
  ) {
    const response = await httpClient.delete(
      `${this.catalogServiceUrl}/${id}`,
      {
        headers: auth ? { Authorization: auth } : undefined,
      },
    );
    return response.data;
  }
}
