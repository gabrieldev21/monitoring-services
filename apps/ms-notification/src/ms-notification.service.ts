import { Injectable } from '@nestjs/common';

@Injectable()
export class MsNotificationService {
  getHello(): string {
    return 'Hello World!';
  }
}
