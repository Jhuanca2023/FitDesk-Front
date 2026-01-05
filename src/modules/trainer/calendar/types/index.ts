import { z } from 'zod';

export const ClassStatusEnum = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type ClassStatus = typeof ClassStatusEnum[keyof typeof ClassStatusEnum];

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

export interface TrainerClass {
  id: string;
  name: string;
  description?: string;
  dayOfWeek: DayOfWeek;
  classDate: Date;
  startTime: string;
  duration: number; 
  capacity: number;
  location: string;
  status: ClassStatus;
  enrolledCount: number;
  enrolledMembers: ClassMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  enrolledAt: Date;
  attendanceStatus?: 'present' | 'absent' | 'late';
}

export interface ClassSession {
  id: string;
  classId: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  status: ClassStatus;
  attendees: ClassAttendee[];
  notes?: string;
}

export interface ClassAttendee {
  memberId: string;
  memberName: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: Date;
  notes?: string;
}


export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  capacity: number;
  enrolledCount: number;
  status: ClassStatus;
  description?: string;
  members: ClassMember[];
}

export interface CalendarFilters {
  status?: ClassStatus;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CalendarView {
  type: 'week' | 'month';
  currentDate: Date;
}

export interface StartClassDTO {
  classId: string;
  sessionDate: Date;
  notes?: string;
}

export interface EndClassDTO {
  sessionId: string;
  endTime: Date;
  attendees: ClassAttendee[];
  notes?: string;
}

export interface UpdateAttendanceDTO {
  sessionId: string;
  attendees: ClassAttendee[];
}

export const StartClassSchema = z.object({
  classId: z.string().min(1, 'ID de clase requerido'),
  sessionDate: z.date(),
  notes: z.string().optional()
});

export const EndClassSchema = z.object({
  sessionId: z.string().min(1, 'ID de sesión requerido'),
  endTime: z.date(),
  attendees: z.array(z.object({
    memberId: z.string(),
    memberName: z.string(),
    status: z.enum(['present', 'absent', 'late']),
    checkInTime: z.date().optional(),
    notes: z.string().optional()
  })),
  notes: z.string().optional()
});


export type CreateClassSessionDTO = z.infer<typeof StartClassSchema>;
export type CompleteClassSessionDTO = z.infer<typeof EndClassSchema>;


export const CLASS_STATUS_LABELS: Record<ClassStatus, string> = {
  [ClassStatusEnum.SCHEDULED]: 'Programada',
  [ClassStatusEnum.IN_PROGRESS]: 'En Progreso',
  [ClassStatusEnum.COMPLETED]: 'Completada',
  [ClassStatusEnum.CANCELLED]: 'Cancelada'
};

export const CLASS_STATUS_COLORS: Record<ClassStatus, string> = {
  [ClassStatusEnum.SCHEDULED]: 'bg-blue-500/10 text-blue-600 border-2 border-blue-500/30',
  [ClassStatusEnum.IN_PROGRESS]: 'bg-yellow-500/10 text-yellow-600 border-2 border-yellow-500/30',
  [ClassStatusEnum.COMPLETED]: 'bg-green-500/10 text-green-600 border-2 border-green-500/30',
  [ClassStatusEnum.CANCELLED]: 'bg-red-500/10 text-red-600 border-2 border-red-500/30'
};

export const DAYS_OF_WEEK = Object.values(DayOfWeekEnum);
