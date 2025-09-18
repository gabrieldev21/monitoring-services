import { SetMetadata } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getJwtSecret, JWT_ALGORITHM } from './jwt-keys';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export async function verifyJwt(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getJwtSecret(),
      { algorithms: [JWT_ALGORITHM], issuer: 'ms-auth' },
      (err, decoded) => {
        if (err) return reject(err);
        const payload = decoded as any;
        if (!payload || payload.type !== 'access') {
          return reject(new Error('Invalid token type'));
        }
        resolve(payload);
      },
    );
  });
}
