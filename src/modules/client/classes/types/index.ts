import { z } from 'zod';


export const ClassStatus = {
  UPCOMING: 'upcoming',
  PENDING: 'pending', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type ClassStatusType = typeof ClassStatus[keyof typeof ClassStatus];


export const ClientClassSchema = z.object({
  id: z.string(),
  reservationId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  trainer: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional()
  }),
  location: z.string(),
  date: z.string(), 
  time: z.string(), 
  duration: z.number(), 
  maxParticipants: z.number(),
  currentParticipants: z.number(),
  status: z.enum(['upcoming', 'pending', 'completed', 'cancelled']),
  canConfirm: z.boolean().default(false),
  canCancel: z.boolean().default(false),
  price: z.number().optional()
});

export type ClientClass = z.infer<typeof ClientClassSchema>;


export const ReservedClassSchema = ClientClassSchema;
export type ReservedClass = ClientClass;


export const ClassFiltersSchema = z.object({
  status: z.enum(['all', 'upcoming', 'pending', 'completed']).optional(),
  trainerId: z.string().optional(),
  location: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

export type ClassFilters = z.infer<typeof ClassFiltersSchema>;


export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional()
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};


export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export type Pagination = z.infer<typeof PaginationSchema>;

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};


export const ConfirmAttendanceDTO = z.object({
  classId: z.string(),
  confirmed: z.boolean()
});

export const CancelClassDTO = z.object({
  classId: z.string(),
  reason: z.string().optional()
});

export type ConfirmAttendanceRequest = z.infer<typeof ConfirmAttendanceDTO>;
export type CancelClassRequest = z.infer<typeof CancelClassDTO>;
