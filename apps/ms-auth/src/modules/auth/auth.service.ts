import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  authenticate() {
    return `This action authenticates a user`;
  }
}
