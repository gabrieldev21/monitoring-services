// src/metrics/metrics.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
import * as express from 'express';

@Injectable()
export class MetricService implements OnModuleInit {
  private readonly app = express();
  private readonly tcpRequestCounter = new client.Counter({
    name: 'auth_tcp_requests_total',
    help: 'Total de requisições TCP recebidas no Auth',
  });

  onModuleInit() {
    // Coleta de métricas padrão do Node.js
    client.collectDefaultMetrics();

    // Endpoint HTTP para expor as métricas
    this.app.get('/metrics', async (req, res) => {
      res.set('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    });

    // Porta para o servidor de métricas
    this.app.listen(9101, () => {
      console.log('Metrics server for ms-auth listening on port 9101');
    });
  }

  incrementTcpRequests() {
    this.tcpRequestCounter.inc();
  }
}
