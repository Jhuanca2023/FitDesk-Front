import { z } from 'zod';

export const AttendanceStatusEnum = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
} as const;

export type AttendanceStatus = typeof AttendanceStatusEnum[keyof typeof AttendanceStatusEnum];


export const AttendanceRecordSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  memberId: z.string(),
  memberName: z.string(),
  memberEmail: z.string(),
  memberAvatar: z.string().optional(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  checkInTime: z.date().optional(),
  checkOutTime: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const AttendanceSessionSchema = z.object({
  id: z.string(),
  classId: z.string(),
  className: z.string(),
  date: z.date(),
  startTime: z.date(),
  endTime: z.date().optional(),
  location: z.string(),
  trainerId: z.string(),
  trainerName: z.string(),
  totalMembers: z.number(),
  presentCount: z.number(),
  absentCount: z.number(),
  lateCount: z.number(),
  excusedCount: z.number(),
  attendanceRecords: z.array(AttendanceRecordSchema),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date()
});

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberAvatar?: string;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  className: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  location: string;
  trainerId: string;
  trainerName: string;
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRecords: AttendanceRecord[];
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceSummary {
  totalSessions: number;
  totalMembers: number;
  averageAttendance: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
}

export interface MemberAttendanceHistory {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberAvatar?: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  lastAttendance?: Date;
  recentSessions: AttendanceRecord[];
}

export interface AttendanceFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: AttendanceStatus;
  classId?: string;
  memberId?: string;
  location?: string;
  searchTerm?: string;
}

export interface AttendanceSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'className' | 'attendanceRate' | 'memberName';
  sortOrder?: 'asc' | 'desc';
  filters?: AttendanceFilters;
}


export interface CreateAttendanceSessionDTO {
  classId: string;
  date: Date;
  startTime: Date;
  notes?: string;
}

export interface UpdateAttendanceDTO {
  sessionId: string;
  attendanceRecords: {
    memberId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
  }[];
}

export interface CompleteAttendanceSessionDTO {
  sessionId: string;
  endTime: Date;
  notes?: string;
}

export interface BulkAttendanceUpdateDTO {
  sessionId: string;
  updates: {
    memberId: string;
    status: AttendanceStatus;
    notes?: string;
  }[];
}

export const CreateAttendanceSessionSchema = z.object({
  classId: z.string().min(1, 'ID de clase requerido'),
  date: z.date(),
  startTime: z.date(),
  notes: z.string().optional()
});

export const UpdateAttendanceSchema = z.object({
  sessionId: z.string().min(1, 'ID de sesión requerido'),
  attendanceRecords: z.array(z.object({
    memberId: z.string().min(1, 'ID de miembro requerido'),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    checkInTime: z.date().optional(),
    checkOutTime: z.date().optional(),
    notes: z.string().optional()
  }))
});

export const BulkAttendanceUpdateSchema = z.object({
  sessionId: z.string().min(1, 'ID de sesión requerido'),
  updates: z.array(z.object({
    memberId: z.string().min(1, 'ID de miembro requerido'),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    notes: z.string().optional()
  }))
});

export type CreateAttendanceSessionData = z.infer<typeof CreateAttendanceSessionSchema>;
export type UpdateAttendanceData = z.infer<typeof UpdateAttendanceSchema>;
export type BulkAttendanceUpdateData = z.infer<typeof BulkAttendanceUpdateSchema>;

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  [AttendanceStatusEnum.PRESENT]: 'Presente',
  [AttendanceStatusEnum.ABSENT]: 'Ausente',
  [AttendanceStatusEnum.LATE]: 'Tarde',
  [AttendanceStatusEnum.EXCUSED]: 'Justificado'
};

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  [AttendanceStatusEnum.PRESENT]: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
  [AttendanceStatusEnum.ABSENT]: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
  [AttendanceStatusEnum.LATE]: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
  [AttendanceStatusEnum.EXCUSED]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
};

export const ATTENDANCE_STATUS_ICONS: Record<AttendanceStatus, string> = {
  [AttendanceStatusEnum.PRESENT]: 'CheckCircle2',
  [AttendanceStatusEnum.ABSENT]: 'XCircle',
  [AttendanceStatusEnum.LATE]: 'Clock',
  [AttendanceStatusEnum.EXCUSED]: 'Shield'
};

export interface PaginatedAttendanceResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
