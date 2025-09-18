import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getJwtSecret, JWT_ALGORITHM } from 'apps/@shared/infra/jwt-keys';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly repo: Repository<Auth>,
  ) {}

  async register(dto: { email: string; password: string; name?: string }) {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });
    await this.repo.save(user);
    const tokens = await this.issueTokens(user);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.repo.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        name: true,
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
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  async refresh(dto: { refreshToken: string }) {
    const payload = this.verifyToken(dto.refreshToken, 'refresh');
    const user = await this.repo.findOne({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, refreshTokenHash: true },
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
      user: { id: user.id, email: user.email, name: user.name },
      ...tokens,
    };
  }

  private async persistRefresh(userId: number, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.repo.update({ id: userId }, { refreshTokenHash });
  }

  private async issueTokens(user: Pick<Auth, 'id' | 'email' | 'name'>) {
    const secret = getJwtSecret();
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, name: user.name, type: 'access' },
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
