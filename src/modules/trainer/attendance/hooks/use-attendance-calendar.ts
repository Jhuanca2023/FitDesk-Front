import { useMemo } from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  addDays,
  subDays
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useAttendanceStore } from '../store/attendance-store';
import { useSessionsByDate } from './use-attendance';
import type { AttendanceSession } from '../types';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  sessions: AttendanceSession[];
  totalSessions: number;
  completedSessions: number;
  attendanceRate: number;
}

export interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
}

export function useAttendanceCalendar() {
  const { selectedDate, setSelectedDate, sessions } = useAttendanceStore();

  const calendarDays = useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const today = new Date();

    return days.map((date): CalendarDay => {
      const daySessions = sessions.filter(session => 
        isSameDay(new Date(session.date), date)
      );

      const completedSessions = daySessions.filter(s => s.status === 'completed');
      const totalAttendees = daySessions.reduce((sum, s) => sum + s.totalMembers, 0);
      const totalPresent = daySessions.reduce((sum, s) => sum + s.presentCount, 0);

      return {
        date,
        isCurrentMonth: date.getMonth() === selectedDate.getMonth(),
        isToday: isSameDay(date, today),
        sessions: daySessions,
        totalSessions: daySessions.length,
        completedSessions: completedSessions.length,
        attendanceRate: totalAttendees > 0 ? (totalPresent / totalAttendees) * 100 : 0
      };
    });
  }, [selectedDate, sessions]);

  const calendarWeeks = useMemo((): CalendarWeek[] => {
    const weeks: CalendarWeek[] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push({
        days: calendarDays.slice(i, i + 7),
        weekNumber: Math.floor(i / 7) + 1
      });
    }
    return weeks;
  }, [calendarDays]);

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const goToDate = (date: Date) => {
    setSelectedDate(date);
  };

  const currentMonthInfo = useMemo(() => {
    const monthName = format(selectedDate, 'MMMM yyyy', { locale: es });
    const totalDays = calendarDays.filter(day => day.isCurrentMonth).length;
    const daysWithSessions = calendarDays.filter(day => 
      day.isCurrentMonth && day.totalSessions > 0
    ).length;
    const totalSessions = calendarDays
      .filter(day => day.isCurrentMonth)
      .reduce((sum, day) => sum + day.totalSessions, 0);
    const completedSessions = calendarDays
      .filter(day => day.isCurrentMonth)
      .reduce((sum, day) => sum + day.completedSessions, 0);

    return {
      monthName,
      totalDays,
      daysWithSessions,
      totalSessions,
      completedSessions,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
    };
  }, [calendarDays, selectedDate]);

  return {
    selectedDate,
    calendarDays,
    calendarWeeks,
    currentMonthInfo,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    goToDate,
    setSelectedDate
  };
}

export function useWeeklyAttendanceView() {
  const { selectedDate, sessions } = useAttendanceStore();

  const weekInfo = useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) {
      return {
        weekStart: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        weekEnd: endOfWeek(selectedDate, { weekStartsOn: 1 }),
        weekRange: '',
        daysWithSessions: [],
        totalSessions: 0,
        completedSessions: 0
      };
    }

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const daysWithSessions = weekDays.map(date => {
      const daySessions = sessions.filter(session => 
        isSameDay(new Date(session.date), date)
      );

      return {
        date,
        dayName: format(date, 'EEEE', { locale: es }),
        dayNumber: format(date, 'd'),
        sessions: daySessions,
        totalSessions: daySessions.length,
        completedSessions: daySessions.filter(s => s.status === 'completed').length,
        inProgressSessions: daySessions.filter(s => s.status === 'in_progress').length,
        scheduledSessions: daySessions.filter(s => s.status === 'scheduled').length
      };
    });

    const weekRange = `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;

    return {
      weekStart,
      weekEnd,
      weekRange,
      daysWithSessions,
      totalSessions: daysWithSessions.reduce((sum, day) => sum + day.totalSessions, 0),
      completedSessions: daysWithSessions.reduce((sum, day) => sum + day.completedSessions, 0)
    };
  }, [selectedDate, sessions]);

  const goToNextWeek = () => {
    const { setSelectedDate } = useAttendanceStore.getState();
    setSelectedDate(addDays(selectedDate, 7));
  };

  const goToPrevWeek = () => {
    const { setSelectedDate } = useAttendanceStore.getState();
    setSelectedDate(subDays(selectedDate, 7));
  };

  return {
    ...weekInfo,
    goToNextWeek,
    goToPrevWeek
  };
}

export function useDaySessions(date: Date | string) {
  const { data: sessions, isLoading, error } = useSessionsByDate(date);
  
  const dayInfo = useMemo(() => {
    if (!sessions) return null;

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const inProgressSessions = sessions.filter(s => s.status === 'in_progress').length;
    const scheduledSessions = sessions.filter(s => s.status === 'scheduled').length;
    const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;

    const totalMembers = sessions.reduce((sum, s) => sum + s.totalMembers, 0);
    const totalPresent = sessions.reduce((sum, s) => sum + s.presentCount, 0);
    const totalAbsent = sessions.reduce((sum, s) => sum + s.absentCount, 0);
    const totalLate = sessions.reduce((sum, s) => sum + s.lateCount, 0);

    return {
      date,
      dayName: format(date, 'EEEE', { locale: es }),
      dayDate: format(date, 'd MMMM yyyy', { locale: es }),
      sessions,
      totalSessions,
      completedSessions,
      inProgressSessions,
      scheduledSessions,
      cancelledSessions,
      totalMembers,
      totalPresent,
      totalAbsent,
      totalLate,
      attendanceRate: totalMembers > 0 ? (totalPresent / totalMembers) * 100 : 0
    };
  }, [date, sessions]);

  return {
    dayInfo,
    sessions,
    isLoading,
    error
  };
}

export function useCalendarStats() {
  const { sessions, selectedDate } = useAttendanceStore();

  return useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) {
      return {
        monthSessions: [],
        todaySessions: [],
        weekSessions: [],
        totalSessions: 0,
        completedSessions: 0,
        attendanceRate: 0
      };
    }

    const validSelectedDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    
    const today = new Date();
    const currentMonth = validSelectedDate.getMonth();
    const currentYear = validSelectedDate.getFullYear();

    const monthSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.getMonth() === currentMonth && 
             sessionDate.getFullYear() === currentYear;
    });

    const todaySessions = sessions.filter(session => 
      isSameDay(new Date(session.date), today)
    );

    const monthStats = {
      totalSessions: monthSessions.length,
      completedSessions: monthSessions.filter(s => s.status === 'completed').length,
      totalMembers: monthSessions.reduce((sum, s) => sum + s.totalMembers, 0),
      totalPresent: monthSessions.reduce((sum, s) => sum + s.presentCount, 0),
      averageAttendance: monthSessions.length > 0 
        ? monthSessions.reduce((sum, s) => sum + (s.totalMembers > 0 ? (s.presentCount / s.totalMembers) * 100 : 0), 0) / monthSessions.length
        : 0
    };

    const todayStats = {
      totalSessions: todaySessions.length,
      completedSessions: todaySessions.filter(s => s.status === 'completed').length,
      inProgressSessions: todaySessions.filter(s => s.status === 'in_progress').length,
      scheduledSessions: todaySessions.filter(s => s.status === 'scheduled').length,
      totalMembers: todaySessions.reduce((sum, s) => sum + s.totalMembers, 0),
      totalPresent: todaySessions.reduce((sum, s) => sum + s.presentCount, 0),
      attendanceRate: todaySessions.reduce((sum, s) => sum + s.totalMembers, 0) > 0
        ? (todaySessions.reduce((sum, s) => sum + s.presentCount, 0) / todaySessions.reduce((sum, s) => sum + s.totalMembers, 0)) * 100
        : 0
    };

    return {
      monthStats,
      todayStats,
      monthName: format(validSelectedDate, 'MMMM yyyy', { locale: es })
    };
  }, [sessions, selectedDate]);
}
