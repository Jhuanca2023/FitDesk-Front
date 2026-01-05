import { z } from 'zod';


export interface ClassRequest {
  className: string;
  locationId: string;
  trainerId: string;
  classDate: string; 
  duration: number;
  maxCapacity: number;
  startTime: string;
  endTime: string;
  active: boolean;
  description?: string;
}

export interface ClassResponse {
  id: string;
  className: string;
  locationName: string;
  trainerName: string;
  classDate: string;
  duration: number;
  maxCapacity: number;
  schedule: string;
  active: boolean;
  description?: string;
}

export interface CalendarClassDTO {
  id: string;
  className: string;
  trainerName: string;
  classDate: string;
  startTime: string;
  endTime: string;
  schedule: string;
  locationName: string;
  currentStudents: number;
  maxCapacity: number;
  action: string;
}


export interface Class {
  id: string;
  className: string;
  locationName: string;
  trainerName: string;
  classDate: string;
  duration: number;
  maxCapacity: number;
  schedule: string;
  active: boolean;
  description?: string;
}

export const DayOfWeekEnum = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
} as const;

export type DayOfWeek = typeof DayOfWeekEnum[keyof typeof DayOfWeekEnum];

export const DAYS_OF_WEEK = Object.values(DayOfWeekEnum);

export const DURATION_OPTIONS = [30, 45, 60, 90] as const;
export type DurationOption = typeof DURATION_OPTIONS[number];



// Schema 
export const ClassSchema = z.object({
  className: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  locationId: z.string().uuid('Selecciona una ubicación válida').min(1, 'Selecciona una ubicación'),
  trainerId: z.string().uuid('Selecciona un entrenador válido').min(1, 'Selecciona un entrenador'),
  classDate: z.string().min(1, 'Selecciona una fecha'),
  duration: z.number().min(30, 'La duración mínima es de 30 minutos'),
  maxCapacity: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida (formato HH:mm)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida (formato HH:mm)'),
  active: z.boolean().default(true),
  description: z.string().optional(),
});


export const ClassFormSchema = z.object({
  className: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  locationId: z.string().min(1, 'Selecciona una ubicación'),
  trainerId: z.string().min(1, 'Selecciona un entrenador'),
  date: z.date(),
  duration: z.number().min(30, 'La duración mínima es de 30 minutos'),
  maxCapacity: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida (formato HH:mm)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida (formato HH:mm)'),
  active: z.boolean().default(true),
  description: z.string().optional(),
});

export type CreateClassDTO = ClassRequest;
export type UpdateClassDTO = Partial<ClassRequest> & { id: string };
