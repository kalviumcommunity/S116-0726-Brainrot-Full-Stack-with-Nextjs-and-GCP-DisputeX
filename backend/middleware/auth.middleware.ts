import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppRole } from '../types/app.types';
import { envConfig } from '../config/env.config';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: AppRole;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret) as { userId: string; role: AppRole };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

export const requireRole = (roles: AppRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    next();
  };
};
