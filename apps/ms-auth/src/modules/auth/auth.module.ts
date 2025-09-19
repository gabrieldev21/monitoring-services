import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'apps/@shared/infra/typeorm.config';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmConfig, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
