import { Module } from '@nestjs/common';
import { MsNotificationController } from './ms-notification.controller';
import { MsNotificationService } from './ms-notification.service';

@Module({
  imports: [],
  controllers: [MsNotificationController],
  providers: [MsNotificationService],
})
export class MsNotificationModule {}
