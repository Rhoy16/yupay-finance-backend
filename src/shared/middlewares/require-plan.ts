import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/app-error.js';
import { AuthenticatedRequest } from './auth-middleware.js';

export const requirePlan = (requiredPlan: 'ESTUDIANTE' | 'PROFESIONAL') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError('Acceso denegado. No se encontró información del usuario.'));
    }

    if (req.user.plan !== requiredPlan) {
      return next(new ForbiddenError(`Acceso denegado. Se requiere el plan ${requiredPlan} para realizar esta acción. Para disfrutar de esta función, mejora a nuestro plan PROFESIONAL.`));
    }

    next();
  };
};
