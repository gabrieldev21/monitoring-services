import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MetricService } from './metric.service';

@Controller()
export class MetricController {
  constructor(private readonly metricsService: MetricService) {}

  @MessagePattern({ cmd: 'metrics' })
  async getMetrics() {
    return { metrics: await this.metricsService.getMetrics() };
  }
}
