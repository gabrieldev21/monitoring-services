import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import axios from 'axios';

@Controller('notification')
export class NotificationController {
  private readonly catalogServiceUrl =
    'http://ms-notification:3004/notification';

  @Post()
  async create(@Body() createNotificationDto: any) {
    const response = await axios.post(
      this.catalogServiceUrl,
      createNotificationDto,
    );
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
  async update(@Param('id') id: string, @Body() updateNotificationDto: any) {
    const response = await axios.patch(
      `${this.catalogServiceUrl}/${id}`,
      updateNotificationDto,
    );
    return response.data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await axios.delete(`${this.catalogServiceUrl}/${id}`);
    return response.data;
  }
}
