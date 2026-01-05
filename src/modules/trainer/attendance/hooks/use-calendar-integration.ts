import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAttendanceStore } from '../store/attendance-store';
import { useCreateAttendanceSession, useMarkAttendance } from './use-attendance';

export function useCalendarIntegration() {
  const { setCurrentSession, setAttendanceModalOpen, setSelectedSessionId } = useAttendanceStore();
  const createSessionMutation = useCreateAttendanceSession();
  const markAttendanceMutation = useMarkAttendance();

  const createSessionFromClass = useCallback(async (classData: {
    classId: string;
    className: string;
    date: Date;
    startTime: Date;
    location: string;
    enrolledMembers: unknown[];
  }) => {
    try {
      const session = await createSessionMutation.mutateAsync({
        classId: classData.classId,
        date: classData.date,
        startTime: classData.startTime
      });

      setCurrentSession(session);
      
      toast.success(`Sesión de asistencia creada para ${classData.className}`);
      return session;
    } catch (error) {
      toast.error('Error al crear la sesión de asistencia');
      throw error;
    }
  }, [createSessionMutation, setCurrentSession]);

  const openAttendanceModal = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
    setAttendanceModalOpen(true);
  }, [setSelectedSessionId, setAttendanceModalOpen]);

  const markAttendanceFromCalendar = useCallback(async (
    sessionId: string,
    memberId: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    notes?: string
  ) => {
    try {
      await markAttendanceMutation.mutateAsync({
        sessionId,
        memberId,
        status,
        notes
      });
      return true;
    } catch (error) {
      return false;
    }
  }, [markAttendanceMutation]);

  const syncCalendarData = useCallback((_calendarData: {
    classId: string;
    sessionId?: string;
    members: unknown[];
    status: string;
  }) => {}, []);

  const getAttendanceStatsForCalendar = useCallback((_sessionId: string) => {
    return {
      totalMembers: 0,
      presentCount: 0,
      absentCount: 0,
      attendanceRate: 0
    };
  }, []);

  return {
    createSessionFromClass,
    openAttendanceModal,
    markAttendanceFromCalendar,
    syncCalendarData,
    getAttendanceStatsForCalendar,
    isCreatingSession: createSessionMutation.isPending,
    isMarkingAttendance: markAttendanceMutation.isPending,
  };
}

export interface CalendarClassData {
  id: string;
  name: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  location: string;
  capacity: number;
  enrolledCount: number;
  enrolledMembers: CalendarMember[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface CalendarMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledAt: Date;
}

export function useAttendanceForCalendar() {
  const integration = useCalendarIntegration();

  const startClassWithAttendance = useCallback(async (classData: CalendarClassData) => {
    try {
      const session = await integration.createSessionFromClass({
        classId: classData.id,
        className: classData.name,
        date: classData.date,
        startTime: classData.startTime,
        location: classData.location,
        enrolledMembers: classData.enrolledMembers
      });

      integration.openAttendanceModal(session.id);
      
      return session;
    } catch (error) {
      throw error;
    }
  }, [integration]);

  const quickMarkAttendance = useCallback(async (
    sessionId: string,
    memberId: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    return integration.markAttendanceFromCalendar(sessionId, memberId, status);
  }, [integration]);

  return {
    startClassWithAttendance,
    quickMarkAttendance,
    openAttendanceModal: integration.openAttendanceModal,
    isLoading: integration.isCreatingSession || integration.isMarkingAttendance
  };
}
