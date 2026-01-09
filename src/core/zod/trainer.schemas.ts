import { z } from 'zod';

export const TrainerPersonalDataSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  dni: z.string().optional(),
  phone: z.string().optional(),
  specialties: z.array(z.string()).optional(),
});

export const SecuritySessionSchema = z.object({
  device: z.string(),
  ip: z.string().optional(),
  lastActive: z.string(),
});

export const TrainerConfigurationSchema = z.object({
  personalData: TrainerPersonalDataSchema,
  sessions: z.array(SecuritySessionSchema).optional(),
});
