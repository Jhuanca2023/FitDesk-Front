
export { default as CalendarPage } from './pages/calendar-page';

export { WeeklyCalendar } from './components/weekly-calendar';
export { ClassManagementModal } from './components/class-management-modal';
export { TrainerStats } from './components/trainer-stats';

export { useCalendarStore, useCalendarDateRange } from './store/calendar-store';
export {
  useTrainerClasses,
  useTrainerClass,
  useClassMembers,
  useClassSessions,
  useCurrentSession,
  useTrainerStats,
  useClassesByDate,
  useClassesByDateRange,
  useStartClass,
  useEndClass,
  useUpdateAttendance,
  useMarkAttendance,
  useCancelClass,
  trainerClassKeys
} from './hooks/use-trainer-classes';

export { TrainerClassService } from './services/trainer-class.service';

export { convertClassesToEvents } from './lib/calendar-utils';

export type {
  ClassStatus,
  DayOfWeek,
  TrainerClass,
  ClassMember,
  ClassSession,
  ClassAttendee,
  CalendarEvent,
  CalendarFilters,
  CalendarView,
  StartClassDTO,
  EndClassDTO,
  UpdateAttendanceDTO,
  CreateClassSessionDTO,
  CompleteClassSessionDTO
} from './types';

export {
  ClassStatusEnum,
  DayOfWeekEnum,
  CLASS_STATUS_LABELS,
  CLASS_STATUS_COLORS,
  DAYS_OF_WEEK
} from './types';

export { cn } from '@/core/lib/utils';
