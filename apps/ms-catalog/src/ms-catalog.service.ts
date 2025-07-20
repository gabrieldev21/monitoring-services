import { Injectable } from '@nestjs/common';

@Injectable()
export class MsCatalogService {
  getHello(): string {
    return 'Hello World!';
  }
}
