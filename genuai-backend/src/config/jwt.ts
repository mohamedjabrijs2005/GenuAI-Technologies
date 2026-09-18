import jwt from 'jsonwebtoken';

// Fail fast at boot if JWT_SECRET isn't set — never fall back to a
// hardcoded value. A forgeable secret is a full auth bypass.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  throw new Error(
    '[FATAL] JWT_SECRET environment variable is missing or too short. ' +
    'Set a strong random secret (32+ chars) before starting the server.'
  );
}

export const JWT_SECRET: string = process.env.JWT_SECRET;

export interface JwtPayload {
  id: number;
  role: string;
  email: string;
}

export function signToken(payload: JwtPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
