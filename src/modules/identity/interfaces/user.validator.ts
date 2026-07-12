import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  username: z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.nombre !== undefined || data.username !== undefined, {
  message: 'El nombre o username es obligatorio',
  path: ['username'],
}).transform((data) => {
  const username = data.username ?? data.nombre;
  return {
    username: username!,
    email: data.email,
    password: data.password,
  };
});

export const loginSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
