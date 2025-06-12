import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricService {
  private readonly register: client.Registry;
  private readonly counter: client.Counter;

  constructor() {
    this.register = client.register;
    this.counter = new client.Counter({
      name: 'http_api_gateway_requests_total',
      help: 'conta as requisições da url',
      labelNames: ['httpStatus'],
      registers: [this.register],
    });
    this.register.setDefaultLabels({ app: 'api-gateway' });
    // client.collectDefaultMetrics({ register: this.register }); validar se necessário usar posteriomente
  }

  async getMetrics(): Promise<string> {
    return await this.register.metrics();
  }

  increment() {
    this.counter.labels('200').inc();
  }
}
