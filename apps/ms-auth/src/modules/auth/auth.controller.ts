import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    // body: { email, password, name? }
    return this.service.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    // body: { email, password }
    return this.service.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    // body: { refreshToken }
    return this.service.refresh(body);
  }
}
