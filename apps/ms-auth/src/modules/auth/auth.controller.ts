import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { MetricService } from '../metric/metric.service';
import { trace, SpanKind } from '@opentelemetry/api';
import {
  withTraceSpan,
  removeTraceContextFromMessage,
  extractTraceContext,
} from '../../../../infra/tracing-utils';

@Controller()
export class AuthController {
  private readonly tracer = trace.getTracer('ms-auth-controller');

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
    const { cleanData, traceContext } = removeTraceContextFromMessage(data);
    const parentContext = traceContext
      ? extractTraceContext(traceContext)
      : undefined;

    return withTraceSpan(
      this.tracer,
      'validate-user-tcp',
      {
        kind: SpanKind.SERVER,
        attributes: {
          'rpc.service': 'ms-auth',
          'rpc.method': 'validate-user',
          'user.id': cleanData.userId,
          'transport.protocol': 'tcp',
        },
        parentContext,
      },
      async (span) => {
        console.log('Auth microservice received TCP request:', cleanData);
        this.metricsService.incrementTcpRequests();

        const result = { valid: true, userId: cleanData.userId };

        span.setAttributes({
          'response.valid': result.valid,
          'response.userId': result.userId,
        });

        return result;
      },
    );
  }

  @MessagePattern({ cmd: 'metrics' })
  async getMetrics(data: any = {}) {
    const { traceContext } = removeTraceContextFromMessage(data);
    const parentContext = traceContext
      ? extractTraceContext(traceContext)
      : undefined;

    return withTraceSpan(
      this.tracer,
      'get-metrics-tcp',
      {
        kind: SpanKind.SERVER,
        attributes: {
          'rpc.service': 'ms-auth',
          'rpc.method': 'metrics',
          'transport.protocol': 'tcp',
        },
        parentContext,
      },
      async () => {
        const metrics = await this.metricsService.getMetrics();
        return { metrics };
      },
    );
  }
}
