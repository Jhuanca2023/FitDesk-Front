// Dashboard Components
export { default as ClientDashboard } from './ClientDashboard';

// Dashboard Services
export { DashboardService } from './services/dashboard.service';
export type { 
  MemberDashboardDTO, 
  WeeklyActivityDTO, 
  UpcomingClassDTO, 
  CalendarClassDTO 
} from './services/dashboard.service';

// Dashboard Hooks
export { 
  useDashboardMember, 
  useClassesCalendar, 
  useUpcomingClasses 
} from './hooks/useDashboard';
