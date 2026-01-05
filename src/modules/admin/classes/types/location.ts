import { z } from 'zod';


export interface LocationRequest {
  name: string;
  description?: string;
  ability: number;
  active: boolean;
}

export interface LocationResponse {
  id: string;
  name: string;
  description?: string;
  ability: number;
  active: boolean;
}


export interface Location {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  isActive: boolean;
}

export const LocationSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  ability: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  active: z.boolean().default(true),
});

export type CreateLocationDTO = LocationRequest;
export type UpdateLocationDTO = Partial<LocationRequest> & { id: string };
