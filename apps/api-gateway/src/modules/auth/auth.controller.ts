import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { injectOtelContext } from '../../../../infra/tracing-utils';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('validate')
  async validateUser() {
    const messageData = injectOtelContext({ userId: 123 });

    return await this.authService
      .send({ cmd: 'validate-user' }, messageData)
      .toPromise();
  }

  @Get('metrics')
  async metrics(@Res() res: Response) {
    const response = await firstValueFrom(
      this.authService.send({ cmd: 'metrics' }, {}),
    );

    res.setHeader('Content-Type', 'text/plain');
    res.send(response.metrics);
  }
}
