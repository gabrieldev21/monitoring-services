import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import axios from 'axios';
import { Headers } from '@nestjs/common';

@Controller('order')
export class OrderController {
  private readonly catalogServiceUrl = 'http://ms-order:3002/order';

  @Post()
  async create(
    @Body() order: any,
    @Headers('authorization') auth?: string,
  ): Promise<any> {
    const response = await axios.post(this.catalogServiceUrl, order, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Get()
  async findAll(@Headers('authorization') auth?: string): Promise<any> {
    const response = await axios.get(this.catalogServiceUrl, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') auth?: string,
  ): Promise<any> {
    const response = await axios.get(`${this.catalogServiceUrl}/${id}`, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }
}
