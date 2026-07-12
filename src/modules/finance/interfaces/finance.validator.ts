import { z } from 'zod';

export const getRatesQuerySchema = z.object({
  amount: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  monto: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  termDays: z.preprocess((val) => (val ? parseInt(val as string, 10) : undefined), z.number().optional()),
  plazo: z.preprocess((val) => (val ? parseInt(val as string, 10) : undefined), z.number().optional()),
  region: z.string().optional(),
  departamento: z.string().optional(),
  productType: z.string().optional(),
  tipoProducto: z.string().optional(),
  currency: z.string().optional(),
  moneda: z.string().optional(),
}).transform((data) => ({
  amount: data.amount ?? data.monto,
  termDays: data.termDays ?? data.plazo,
  region: data.region ?? data.departamento,
  productType: data.productType ?? data.tipoProducto,
  currency: data.currency ?? data.moneda,
}));

export const saveSimulationSchema = z.object({
  amount: z.number().positive('El monto debe ser un número positivo').optional(),
  monto: z.number().positive('El monto debe ser un número positivo').optional(),
  termDays: z.number().int().positive('El plazo debe ser mayor a 0 días').optional(),
  plazo: z.number().int().positive('El plazo debe ser mayor a 0 días').optional(),
  rate: z.number().nonnegative('La tasa debe ser mayor o igual a 0').optional(),
  tasa: z.number().nonnegative('La tasa debe ser mayor o igual a 0').optional(),
  earnedInterest: z.number().optional(),
  interesGanado: z.number().optional(),
  entityId: z.string().uuid('Identificador de entidad inválido (UUID)').optional(),
  entidadId: z.string().uuid('Identificador de entidad inválido (UUID)').optional(),
}).refine((data) => {
  return (data.amount !== undefined || data.monto !== undefined) &&
         (data.termDays !== undefined || data.plazo !== undefined) &&
         (data.rate !== undefined || data.tasa !== undefined) &&
         (data.entityId !== undefined || data.entidadId !== undefined);
}, {
  message: 'Faltan parámetros requeridos para la simulación'
}).transform((data) => ({
  amount: (data.amount ?? data.monto)!,
  termDays: (data.termDays ?? data.plazo)!,
  rate: (data.rate ?? data.tasa)!,
  earnedInterest: data.earnedInterest ?? data.interesGanado,
  entityId: (data.entityId ?? data.entidadId)!,
}));
