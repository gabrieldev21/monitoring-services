import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MetricModule } from './metric/metric.module';

@Module({
  imports: [AuthModule, MetricModule],
})
export class AppModule {}
