import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { MetricService } from '../metric/metric.service';

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
    console.log('Auth microservice received TCP request:', data);
    this.metricsService.incrementTcpRequests();
    return { valid: true, userId: data.userId };
  }
}
