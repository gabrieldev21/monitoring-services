import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Headers,
} from '@nestjs/common';
import axios from 'axios';

@Controller('notification')
export class NotificationController {
  private readonly catalogServiceUrl =
    'http://ms-notification:3004/notification';

  @Post()
  async create(
    @Body() createNotificationDto: any,
    @Headers('authorization') auth?: string,
  ) {
    const response = await axios.post(
      this.catalogServiceUrl,
      createNotificationDto,
      { headers: auth ? { Authorization: auth } : undefined },
    );
    return response.data;
  }

  @Get()
  async findAll(@Headers('authorization') auth?: string) {
    const response = await axios.get(this.catalogServiceUrl, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

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
    @Body() updateNotificationDto: any,
    @Headers('authorization') auth?: string,
  ) {
    const response = await axios.patch(
      `${this.catalogServiceUrl}/${id}`,
      updateNotificationDto,
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
