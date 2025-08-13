import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import axios from 'axios';

@Controller('order')
export class OrderController {
  private readonly catalogServiceUrl = 'http://ms-order:3000/order';

  @Post()
  async create(@Body() order: any): Promise<any> {
    const response = await axios.post(this.catalogServiceUrl, order);
    return response.data;
  }

  @Get()
  async findAll(): Promise<any> {
    const response = await axios.get(this.catalogServiceUrl);
    return response.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const response = await axios.get(`${this.catalogServiceUrl}/${id}`);
    return response.data;
  }
}
