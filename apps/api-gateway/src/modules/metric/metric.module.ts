import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MetricService } from './metric.service';
import { AuthController } from './auth.controller';
import { MetricController } from './metric.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'ms-auth', port: 3001 }, // 'ms-auth' deve ser o nome do serviço no docker-compose ou 'localhost' se local
      },
    ]),
  ],
  controllers: [AuthController, MetricController],
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {}
