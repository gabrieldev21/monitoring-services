import { Controller, Body, Post, Get, Param, Headers } from '@nestjs/common';
import { CreateNotificationDto } from 'apps/@shared/DTO/notification/create-notification.dto';
import axios from 'axios';

@Controller('notification')
export class NotificationController {
  private readonly notificationServiceUrl =
    'http://ms-notification:3004/notification';

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Headers('authorization') auth?: string,
  ) {
    const response = await axios.post(
      this.notificationServiceUrl,
      createNotificationDto,
      { headers: auth ? { Authorization: auth } : undefined },
    );
    return response.data;
  }

  @Get()
  async findAll(@Headers('authorization') auth?: string) {
    const response = await axios.get(this.notificationServiceUrl, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') auth?: string,
  ) {
    const response = await axios.get(`${this.notificationServiceUrl}/${id}`, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return response.data;
  }
}
