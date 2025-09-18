let cachedSecret: string | null = null;

// Single shared secret for HS256 signing/verification
export function getJwtSecret(): string {
  if (cachedSecret) return cachedSecret;
  const envSecret = process.env.JWT_SECRET;
  cachedSecret =
    envSecret && envSecret.length > 0
      ? envSecret
      : 'dev-super-secret-change-me';
  return cachedSecret;
}

export function resetCachedSecret() {
  cachedSecret = null;
}

export const JWT_ALGORITHM = 'HS256' as const;
