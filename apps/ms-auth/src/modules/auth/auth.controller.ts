import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'apps/@shared/DTO/auth/create-user.dto';
import { RefreshLoginDto } from 'apps/@shared/DTO/auth/refresh-login.dto';
import { ValidateUserDto } from 'apps/@shared/DTO/auth/validate-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.service.register(body);
  }

  @Post('login')
  async login(@Body() body: ValidateUserDto) {
    return this.service.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshLoginDto) {
    return this.service.refresh(body);
  }
}
