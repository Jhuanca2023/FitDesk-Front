import { z } from 'zod';

export const AdminProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos').optional(),
  role: z.string(),
  joinDate: z.string(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

export const UpdateAdminProfileSchema = AdminProfileSchema.pick({
  name: true,
  email: true,
  phone: true,
  address: true,
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmación de contraseña requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type AdminProfile = z.infer<typeof AdminProfileSchema>;
export type UpdateAdminProfile = z.infer<typeof UpdateAdminProfileSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
