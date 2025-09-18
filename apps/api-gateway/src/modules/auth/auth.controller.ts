import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { Public } from './jwt.util';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  private msAuthUrl = process.env.MS_AUTH_URL || 'http://ms-auth:3011/auth';

  @Public()
  @Post('login')
  async login(@Body() body: any) {
    const { data } = await axios.post(`${this.msAuthUrl}/login`, body);
    return data;
  }

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    const { data } = await axios.post(`${this.msAuthUrl}/register`, body);
    return data;
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: any) {
    const { data } = await axios.post(`${this.msAuthUrl}/refresh`, body);
    return data;
  }
}
