import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getJwtSecret, JWT_ALGORITHM } from 'apps/@shared/infra/jwt-keys';
import { CreateUserDto } from 'apps/@shared/DTO/auth/create-user.dto';
import { ValidateUserDto } from 'apps/@shared/DTO/auth/validate-user.dto';
import { RefreshLoginDto } from 'apps/@shared/DTO/auth/refresh-login.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly repo: Repository<Auth>,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      email: dto.email,
      passwordHash,
    });
    await this.repo.save(user);
    const tokens = await this.issueTokens(user);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email },
      ...tokens,
    };
  }

  async login(dto: ValidateUserDto) {
    const user = await this.repo.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        refreshTokenHash: true,
      },
    });
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.issueTokens(user);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email },
      ...tokens,
    };
  }

  async refresh(dto: RefreshLoginDto) {
    const payload = this.verifyToken(dto.refreshToken, 'refresh');
    const user = await this.repo.findOne({
      where: { id: payload.sub },
      select: { id: true, email: true, refreshTokenHash: true },
    });
    if (!user || !user.refreshTokenHash)
      throw new UnauthorizedException('Invalid refresh token');
    const matches = await bcrypt.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );
    if (!matches) throw new UnauthorizedException('Invalid refresh token');
    const tokens = await this.issueTokens(user);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email },
      ...tokens,
    };
  }

  private async persistRefresh(userId: number, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.repo.update({ id: userId }, { refreshTokenHash });
  }

  private async issueTokens(user: Pick<Auth, 'id' | 'email'>) {
    const secret = getJwtSecret();
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, type: 'access' },
      secret,
      { algorithm: JWT_ALGORITHM, expiresIn: '15m', issuer: 'ms-auth' },
    );
    const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, secret, {
      algorithm: JWT_ALGORITHM,
      expiresIn: '7d',
      issuer: 'ms-auth',
    });
    return { accessToken, refreshToken };
  }

  verifyToken(token: string, expectedType: 'access' | 'refresh') {
    const secret = getJwtSecret();
    const payload = jwt.verify(token, secret, {
      algorithms: [JWT_ALGORITHM],
      issuer: 'ms-auth',
    }) as any;
    if (payload.type !== expectedType)
      throw new UnauthorizedException('Invalid token type');
    return payload;
  }
}
