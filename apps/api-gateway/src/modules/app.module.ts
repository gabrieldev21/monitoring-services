import { Module } from '@nestjs/common';
import { MetricModule } from './metric/metric.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MetricModule, AuthModule],
})
export class AppModule {}
