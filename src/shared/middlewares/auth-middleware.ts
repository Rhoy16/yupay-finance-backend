import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError } from '../errors/app-error.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    plan: 'ESTUDIANTE' | 'PROFESIONAL';
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Acceso no autorizado. Formato de token inválido o ausente.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      username: string;
      email: string;
      plan: 'ESTUDIANTE' | 'PROFESIONAL';
    };

    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError('Token de sesión inválido o expirado.'));
  }
};
