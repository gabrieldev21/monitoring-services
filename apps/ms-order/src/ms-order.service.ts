import { Injectable } from '@nestjs/common';

@Injectable()
export class MsOrderService {
  getHello(): string {
    return 'Hello World!';
  }
}
