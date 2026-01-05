import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { attendanceService } from '../services/attendance.service';
import { useAttendanceStore } from '../store/attendance-store';
import type {
  AttendanceSearchParams,
  CreateAttendanceSessionDTO,
  UpdateAttendanceDTO,
  CompleteAttendanceSessionDTO,
  BulkAttendanceUpdateDTO
} from '../types';

export const attendanceKeys = {
  all: ['attendance'] as const,
  sessions: () => [...attendanceKeys.all, 'sessions'] as const,
  session: (id: string) => [...attendanceKeys.sessions(), id] as const,
  sessionsByDate: (date: string) => [...attendanceKeys.sessions(), 'by-date', date] as const,
  sessionsByClass: (classId: string) => [...attendanceKeys.sessions(), 'by-class', classId] as const,
  summary: (params?: unknown) => [...attendanceKeys.all, 'summary', params] as const,
  memberHistory: (params?: unknown) => [...attendanceKeys.all, 'member-history', params] as const,
  quickStats: () => [...attendanceKeys.all, 'quick-stats'] as const,
};

export function useAttendanceSessions(params?: AttendanceSearchParams) {
  const { setSessions, setPagination } = useAttendanceStore();

  return useQuery({
    queryKey: [...attendanceKeys.sessions(), params],
    queryFn: () => attendanceService.getAttendanceSessions(params),
    select: (data) => {
      setSessions(data.data);
      setPagination(data.pagination);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAttendanceSession(sessionId: string) {
  const { setCurrentSession } = useAttendanceStore();

  return useQuery({
    queryKey: attendanceKeys.session(sessionId),
    queryFn: () => attendanceService.getAttendanceSession(sessionId),
    enabled: !!sessionId,
    select: (data) => {
      setCurrentSession(data);
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useSessionsByDate(date: Date | string) {
  const validDate = date instanceof Date ? date : new Date(date);
  const dateStr = validDate.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: attendanceKeys.sessionsByDate(dateStr),
    queryFn: () => attendanceService.getSessionsByDate(validDate),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSessionsByClass(classId: string, params?: AttendanceSearchParams) {
  return useQuery({
    queryKey: [...attendanceKeys.sessionsByClass(classId), params],
    queryFn: () => attendanceService.getSessionsByClass(classId, params),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAttendanceSummary(params?: { dateRange?: { start: Date; end: Date }; classId?: string; }) {
  const { setSummary } = useAttendanceStore();

  return useQuery({
    queryKey: attendanceKeys.summary(params),
    queryFn: () => attendanceService.getAttendanceSummary(params),
    select: (data) => {
      setSummary(data);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useMemberAttendanceHistory(params?: AttendanceSearchParams) {
  const { setMemberHistory, setPagination } = useAttendanceStore();

  return useQuery({
    queryKey: [...attendanceKeys.memberHistory(), params],
    queryFn: () => attendanceService.getMemberAttendanceHistory(params),
    select: (data) => {
      setMemberHistory(data.data);
      setPagination(data.pagination);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useQuickStats() {
  const { setQuickStats } = useAttendanceStore();

  return useQuery({
    queryKey: attendanceKeys.quickStats(),
    queryFn: () => attendanceService.getQuickStats(),
    select: (data) => {
      setQuickStats(data);
      return data;
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useCreateAttendanceSession() {
  const queryClient = useQueryClient();
  const { addSession } = useAttendanceStore();

  return useMutation({
    mutationFn: (data: CreateAttendanceSessionDTO) => 
      attendanceService.createAttendanceSession(data),
    onSuccess: (data) => {
      addSession(data);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.quickStats() });
      toast.success('Sesión de asistencia creada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al crear la sesión';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  const { updateSession } = useAttendanceStore();

  return useMutation({
    mutationFn: (data: UpdateAttendanceDTO) => 
      attendanceService.updateAttendance(data),
    onSuccess: (data) => {
      updateSession(data.id, data);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.session(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions() });
      toast.success('Asistencia actualizada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar la asistencia';
      toast.error(errorMessage);
    },
  });
}

export function useBulkUpdateAttendance() {
  const queryClient = useQueryClient();
  const { updateSession } = useAttendanceStore();

  return useMutation({
    mutationFn: (data: BulkAttendanceUpdateDTO) => 
      attendanceService.bulkUpdateAttendance(data),
    onSuccess: (data) => {
      updateSession(data.id, data);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.session(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions() });
      toast.success('Asistencia actualizada masivamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error en la actualización masiva';
      toast.error(errorMessage);
    },
  });
}

export function useCompleteAttendanceSession() {
  const queryClient = useQueryClient();
  const { updateSession } = useAttendanceStore();

  return useMutation({
    mutationFn: (data: CompleteAttendanceSessionDTO) => 
      attendanceService.completeAttendanceSession(data),
    onSuccess: (data) => {
      updateSession(data.id, data);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.session(data.id) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.quickStats() });
      toast.success('Sesión completada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al completar la sesión';
      toast.error(errorMessage);
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { updateAttendanceRecord } = useAttendanceStore();

  return useMutation({
    mutationFn: ({ 
      sessionId, 
      memberId, 
      status, 
      notes 
    }: { 
      sessionId: string; 
      memberId: string; 
      status: 'present' | 'absent' | 'late' | 'excused'; 
      notes?: string; 
    }) => attendanceService.markAttendance(sessionId, memberId, status, notes),
    onSuccess: (_, variables) => {
      updateAttendanceRecord(variables.sessionId, variables.memberId, variables.status, variables.notes);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.session(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.sessions() });
      
      const statusLabels = {
        present: 'presente',
        absent: 'ausente',
        late: 'tarde',
        excused: 'justificado'
      };
      toast.success(`Miembro marcado como ${statusLabels[variables.status]}`);
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al marcar asistencia';
      toast.error(errorMessage);
    },
  });
}

export function useExportAttendanceReport() {
  return useMutation({
    mutationFn: ({ 
      format, 
      params 
    }: { 
      format: 'pdf' | 'excel' | 'csv'; 
      params?: AttendanceSearchParams; 
    }) => attendanceService.exportAttendanceReport(format, params),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extensions = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };
      const today = new Date().toISOString().split('T')[0];
      link.download = `reporte-asistencia-${today}.${extensions[variables.format]}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      const formatLabels = { pdf: 'PDF', excel: 'Excel', csv: 'CSV' };
      toast.success(`Reporte ${formatLabels[variables.format]} descargado correctamente`);
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al exportar el reporte';
      toast.error(errorMessage);
    },
  });
}
