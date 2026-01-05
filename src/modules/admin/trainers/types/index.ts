import { z } from 'zod';

export const TrainerSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  documentNumber: z.string().min(8, 'El DNI debe tener al menos 8 caracteres'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  profileImage: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  specialties: z.string().min(5, 'Especifica al menos una especialidad'),
  yearsOfExperience: z.number().min(0, 'La experiencia no puede ser negativa'),
  certifications: z.string().optional(),
  certificationImages: z.array(z.string()).optional(),
  availability: z.record(z.string(), z.boolean()),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  joinDate: z.string().min(1, 'La fecha de ingreso es requerida'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).default('ACTIVE'),
  contractType: z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'PER_HOUR']),
  salary: z.number().min(0, 'El salario no puede ser negativo'),
  bankInfo: z.string().optional(),
  notes: z.string().optional(),
});

export type Trainer = z.infer<typeof TrainerSchema>;
export type TrainerFormData = Omit<Trainer, 'id'>;

export interface TrainerAvailability {
  day: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
}

export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'SUSPENDED', label: 'Suspendido' },
] as const;

export const CONTRACT_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Tiempo completo' },
  { value: 'PART_TIME', label: 'Medio tiempo' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'PER_HOUR', label: 'Por hora' },
] as const;
