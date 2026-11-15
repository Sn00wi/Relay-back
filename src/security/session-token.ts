import * as crypto from 'node:crypto';

export function generateSessionToken(): string {
  const token = crypto.randomBytes(32).toString('hex')
  return token;
} 

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}