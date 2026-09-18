import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../config/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/** Requires a valid Bearer token. Rejects with 401 if missing/invalid. */
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

/** Attaches req.user if a valid token is present, but never rejects the request. */
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

/** Restricts to specific roles. Use AFTER authenticateToken. */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

/**
 * Allows access if the caller IS the resource owner (req.params[paramName] === req.user.id)
 * OR has one of the given elevated roles (e.g. admin). Use AFTER authenticateToken.
 */
export function requireSelfOrRole(paramName: string, ...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
    const targetId = Number(req.params[paramName]);
    if (req.user.id === targetId || roles.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'You do not have permission to access this resource.' });
  };
}
