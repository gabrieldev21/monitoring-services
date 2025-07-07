import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

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

  @Get('metrics')
  async metrics(@Res() res: Response) {
    const response = await firstValueFrom(
      this.authService.send({ cmd: 'metrics' }, {}),
    );

    res.setHeader('Content-Type', 'text/plain');
    res.send(response.metrics);
  }
}
