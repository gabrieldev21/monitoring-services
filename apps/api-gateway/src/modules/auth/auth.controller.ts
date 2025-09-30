import { Body, Controller, Post } from '@nestjs/common';
import httpClient from 'apps/@shared/infra/http/http-client';
import { Public } from 'apps/@shared/infra/jwt/jwt.util';
import { CreateUserDto } from 'apps/@shared/DTO/auth/create-user.dto';
import { ValidateUserDto } from 'apps/@shared/DTO/auth/validate-user.dto';
import { RefreshLoginDto } from 'apps/@shared/DTO/auth/refresh-login.dto';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  async login(@Body() body: ValidateUserDto) {
    const { data } = await httpClient.post(
      `${process.env.MS_AUTH_URL}/login`,
      body,
    );
    return data;
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const { data } = await httpClient.post(
      `${process.env.MS_AUTH_URL}/register`,
      body,
    );
    return data;
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshLoginDto) {
    const { data } = await httpClient.post(
      `${process.env.MS_AUTH_URL}/refresh`,
      body,
    );
    return data;
  }
}
