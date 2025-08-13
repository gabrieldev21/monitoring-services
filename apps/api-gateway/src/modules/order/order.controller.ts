import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import axios from 'axios';

@Controller('order')
export class OrderController {
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  @Post()
  async create(@Body() order: any): Promise<any> {
    const response = await axios.post('http://order-service:3000/order', order);
    return response.data;
  }

  @Get()
  async findAll(): Promise<any> {
    const response = await axios.get('http://order-service:3000/order');
    return response.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const response = await axios.get(`http://order-service:3000/order/${id}`);
    return response.data;
  }
}
