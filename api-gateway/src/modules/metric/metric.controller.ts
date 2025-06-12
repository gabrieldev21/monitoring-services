import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricService } from './metric.service';

@Controller()
export class MetricController {
  constructor(private readonly metricsService: MetricService) {}

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    const metrics = await this.metricsService.getMetrics();
    res.setHeader('Content-Type', 'text/plain');
    res.send(metrics);
  }

  @Get('health')
  healthCheck(): string {
    this.metricsService.increment();
    return 'OK';
  }
}
