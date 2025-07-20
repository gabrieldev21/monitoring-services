import { Controller, Get } from '@nestjs/common';
import { MsCatalogService } from './ms-catalog.service';

@Controller()
export class MsCatalogController {
  constructor(private readonly msCatalogService: MsCatalogService) {}

  @Get()
  getHello(): string {
    return this.msCatalogService.getHello();
  }
}
