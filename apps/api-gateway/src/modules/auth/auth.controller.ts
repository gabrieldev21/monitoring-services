import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { injectOtelContext } from '../../../../infra/tracing-utils';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('validate')
  async validateUser(@Body() body: any) {
    const messageData = injectOtelContext({ userId: body.userId });

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
