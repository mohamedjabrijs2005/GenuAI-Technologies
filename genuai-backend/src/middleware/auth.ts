import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

// Extend Passport's existing Express.User interface instead of redeclaring
// req.user's type — Passport already augments Express.Request globally,
// and TypeScript requires all such augmentations to agree.
declare global {
  namespace Express {
    interface User {
      id: number;
      role: string;
      email: string;
    }
  }
}

/** Safely handles Express 5's string | string[] route param type. */
export function paramString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : (value || '');
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const decoded = verifyToken(authHeader.split(' ')[1]);
    req.user = { id: Number(decoded.id), role: decoded.role, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = verifyToken(authHeader.split(' ')[1]);
      req.user = { id: Number(decoded.id), role: decoded.role, email: decoded.email };
    } catch {
      // ignore invalid token, proceed unauthenticated
    }
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

export function requireSelfOrRole(paramName: string, ...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
    const targetId = Number(paramString(req.params[paramName]));
    if (req.user.id === targetId || roles.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'You do not have permission to access this resource.' });
  };
}
