import { Controller, Get, Post } from '@nestjs/common';

@Controller('order')
export class OrderController {
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  @Post()
  showStates() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'api-gateway',
    };
  }
}
