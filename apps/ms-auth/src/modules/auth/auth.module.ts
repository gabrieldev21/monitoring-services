import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'apps/@shared/infra/typeorm.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MetricModule } from '../metric/metric.module';
import { Auth } from './entities/auth.entity';

@Module({
  imports: [MetricModule, TypeOrmConfig, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
