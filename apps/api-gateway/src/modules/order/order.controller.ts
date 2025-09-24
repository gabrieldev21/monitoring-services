import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import httpClient from 'apps/@shared/infra/http/http-client';
import { Public } from 'apps/@shared/infra/jwt/jwt.util';
import { Headers } from '@nestjs/common';

@Controller('order')
export class OrderController {
  private readonly catalogServiceUrl = 'http://ms-order:3004/ms-order';

  @Public()
  @Post()
  async create(
    @Body() order: any,
    @Headers('authorization') auth?: string,
  ): Promise<any> {
    const response = await httpClient.post(this.catalogServiceUrl, order, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Public()
  @Get()
  async findAll(@Headers('authorization') auth?: string): Promise<any> {
    const response = await httpClient.get(this.catalogServiceUrl, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') auth?: string,
  ): Promise<any> {
    const response = await httpClient.get(`${this.catalogServiceUrl}/${id}`, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }
}
