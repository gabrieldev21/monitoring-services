import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NODE_ENV === 'production' ? 'ms-auth' : 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
