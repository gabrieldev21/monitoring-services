import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MetricModule } from '../metric/metric.module';

@Module({
  imports: [MetricModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
