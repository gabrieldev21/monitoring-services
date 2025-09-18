import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';
import { Public } from './jwt.util';
import { CreateUserDto } from 'apps/@shared/DTO/auth/DTO/create-user.dto';
import { ValidateUserDto } from 'apps/@shared/DTO/auth/DTO/validate-user.dto';
import { RefreshLoginDto } from 'apps/@shared/DTO/auth/DTO/refresh-login.dto';

@Controller('auth')
export class AuthController {
  private msAuthUrl = process.env.MS_AUTH_URL || 'http://ms-auth:3001/auth';

  @Public()
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    const { data } = await axios.post(`${this.msAuthUrl}/login`, body);
    return data;
  }

  @Public()
  @Post('register')
  async register(@Body() body: ValidateUserDto) {
    const { data } = await axios.post(`${this.msAuthUrl}/register`, body);
    return data;
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshLoginDto) {
    const { data } = await axios.post(`${this.msAuthUrl}/refresh`, body);
    return data;
  }
}
