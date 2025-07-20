import { Controller, Get } from '@nestjs/common';
import { MsNotificationService } from './ms-notification.service';

@Controller()
export class MsNotificationController {
  constructor(private readonly msNotificationService: MsNotificationService) {}

  @Get()
  getHello(): string {
    return this.msNotificationService.getHello();
  }
}
