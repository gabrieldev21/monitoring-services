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
import axios from 'axios';
import { CreateCatalogDto } from 'apps/@shared/DTO/catalog/create-catalog.dto';
import { Public } from 'apps/@shared/infra/jwt/jwt.util';

@Controller('catalog')
export class CatalogController {
  private readonly catalogServiceUrl = 'http://ms-catalog:3003/ms-catalog';

  @Public()
  @Post()
  async create(
    @Body() createCatalogDto: CreateCatalogDto,
    @Headers('authorization') auth?: string,
  ) {
    const response = await axios.post(
      this.catalogServiceUrl,
      createCatalogDto,
      {
        headers: auth ? { Authorization: auth } : undefined,
      },
    );
    return response.data;
  }

  @Public()
  @Get()
  async findAll(@Headers('authorization') auth?: string) {
    const response = await axios.get(this.catalogServiceUrl, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') auth?: string,
  ) {
    const response = await axios.get(`${this.catalogServiceUrl}/${id}`, {
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
    const response = await axios.patch(
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
    const response = await axios.delete(`${this.catalogServiceUrl}/${id}`, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }
}
