import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { trace } from '@opentelemetry/api';
import { extractOtelContext } from '../../../../infra/tracing-utils';
import { MetricService } from '../metric/metric.service';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly metricsService: MetricService,
  ) {}

  @MessagePattern('auth')
  auth() {
    return this.authService.authenticate();
  }

  @MessagePattern({ cmd: 'validate-user' })
  async validateUser(data: any) {
    this.metricsService.incrementTcpRequests();

    return extractOtelContext(data, () => {
      const span = trace
        .getTracer(process.env.SERVICE_NAME ?? 'microservice')
        .startSpan('message_validate_user');
      span.setAttributes({
        'user.id': data.userId,
      });
      span.addEvent('Processando mensagem');
      span.end();
      return { userId: data.userId, processed: true };
    });
  }
}
