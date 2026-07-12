import { z } from 'zod';

export const getRatesQuerySchema = z.object({
  monto: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  plazo: z.preprocess((val) => (val ? parseInt(val as string, 10) : undefined), z.number().optional()),
  departamento: z.string().optional(),
  tipoProducto: z.string().optional(),
  moneda: z.string().optional(),
});

export const saveSimulationSchema = z.object({
  monto: z.number().positive('El monto debe ser un número positivo'),
  plazo: z.number().int().positive('El plazo debe ser mayor a 0 días'),
  tasa: z.number().nonnegative('La tasa debe ser mayor o igual a 0'),
  interesGanado: z.number().optional(),
  entidadId: z.string().uuid('Identificador de entidad inválido (UUID)'),
});
