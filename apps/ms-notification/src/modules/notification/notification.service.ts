import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  private notifications: Array<{
    id: number;
    message: string;
    type: string;
    createdAt: Date;
  }> = [];
  private idCounter = 1;

  create(createNotificationDto: CreateNotificationDto) {
    const notification = {
      id: this.idCounter++,
      message: createNotificationDto.message,
      type: createNotificationDto.type, // e.g., 'alert', 'info', 'warning'
      createdAt: new Date(),
    };
    this.notifications.push(notification);
    return notification;
  }

  findAll() {
    // In a lab environment, you might filter by type or recent notifications
    return this.notifications;
  }

  findOne(id: number) {
    return this.notifications.find((n) => n.id === id);
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.message =
        updateNotificationDto.message ?? notification.message;
      notification.type = updateNotificationDto.type ?? notification.type;
      return notification;
    }
    return null;
  }

  remove(id: number) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      return this.notifications.splice(index, 1)[0];
    }
    return null;
  }
}
