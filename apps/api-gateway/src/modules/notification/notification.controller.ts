import { Controller, Body, Post, Get, Param, Headers } from '@nestjs/common';
import { CreateNotificationDto } from 'apps/@shared/DTO/notification/create-notification.dto';
import { Public } from 'apps/@shared/infra/jwt/jwt.util';
import httpClient from 'apps/@shared/infra/http/http-client';

@Controller('notification')
export class NotificationController {
  private readonly notificationServiceUrl =
    'http://ms-notification:3003/ms-notification';

  @Public()
  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Headers('authorization') auth?: string,
  ) {
    const response = await httpClient.post(
      this.notificationServiceUrl,
      createNotificationDto,
      { headers: auth ? { Authorization: auth } : undefined },
    );
    return response.data;
  }

  @Public()
  @Get()
  async findAll(@Headers('authorization') auth?: string) {
    const response = await httpClient.get(this.notificationServiceUrl, {
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
    const response = await httpClient.get(
      `${this.notificationServiceUrl}/${id}`,
      {
        headers: auth ? { Authorization: auth } : undefined,
      },
    );
    return response.data;
  }
}
