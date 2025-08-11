import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { trace, SpanKind } from '@opentelemetry/api';
import {
  withTraceSpan,
  addTraceContextToMessage,
} from '../../../../infra/tracing-utils';

@Controller('auth')
export class AuthController {
  private readonly tracer = trace.getTracer('api-gateway-auth-controller');

  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('validate')
  async validateUser() {
    return withTraceSpan(
      this.tracer,
      'validate-user-tcp-client',
      {
        kind: SpanKind.CLIENT,
        attributes: {
          'rpc.service': 'ms-auth',
          'rpc.method': 'validate-user',
          'transport.protocol': 'tcp',
          'user.id': 123,
        },
      },
      async (span) => {
        const messageData = addTraceContextToMessage({ userId: 123 });

        const response = await this.authService
          .send({ cmd: 'validate-user' }, messageData)
          .toPromise();

        span.setAttributes({
          'response.valid': response.valid,
          'response.userId': response.userId,
        });

        return response;
      },
    );
  }

  @Get('metrics')
  async metrics(@Res() res: Response) {
    return withTraceSpan(
      this.tracer,
      'get-metrics-tcp-client',
      {
        kind: SpanKind.CLIENT,
        attributes: {
          'rpc.service': 'ms-auth',
          'rpc.method': 'metrics',
          'transport.protocol': 'tcp',
        },
      },
      async () => {
        const messageData = addTraceContextToMessage({});

        const response = await firstValueFrom(
          this.authService.send({ cmd: 'metrics' }, messageData),
        );

        res.setHeader('Content-Type', 'text/plain');
        res.send(response.metrics);
      },
    );
  }
}
