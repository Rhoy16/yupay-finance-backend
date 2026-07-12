import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { logger } from '../../config/logger.js';
import { z } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Manejo de errores de validación de Zod
  if (error instanceof z.ZodError) {
    logger.warn(`Error de validación en ${req.method} ${req.url}: ${JSON.stringify(error.format())}`);
    res.status(400).json({
      message: 'Error de validación en los datos provistos',
      errors: error.format(),
    });
    return;
  }

  // Manejo de nuestros errores customizados de dominio/aplicación
  if (error instanceof AppError) {
    logger.warn(`Error del cliente en ${req.method} ${req.url}: Status ${error.statusCode} - ${error.message}`);
    res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  // Manejo de errores inesperados del sistema
  logger.error(`Error no controlado en ${req.method} ${req.url}: ${error.stack || error.message}`);
  res.status(500).json({
    message: 'Ha ocurrido un error interno en el servidor',
  });
};
