// auth.controller.ts no API Gateway
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('validate')
  async validateUser() {
    const response = await this.authService
      .send({ cmd: 'validate-user' }, { userId: 123 })
      .toPromise();
    return response;
  }
}
