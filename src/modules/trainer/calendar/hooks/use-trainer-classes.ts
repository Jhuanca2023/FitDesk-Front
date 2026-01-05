import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainerClassService } from '../services/trainer-class.service';
import { toast } from 'sonner';
import type { 
  CalendarFilters, 
  StartClassDTO, 
  EndClassDTO,
  UpdateAttendanceDTO
} from '../types';


export const trainerClassKeys = {
  all: ['trainer-classes'] as const,
  lists: () => [...trainerClassKeys.all, 'list'] as const,
  list: (filters?: CalendarFilters) => [...trainerClassKeys.lists(), filters] as const,
  details: () => [...trainerClassKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainerClassKeys.details(), id] as const,
  members: (classId: string) => [...trainerClassKeys.all, 'members', classId] as const,
  sessions: (classId: string) => [...trainerClassKeys.all, 'sessions', classId] as const,
  currentSession: () => [...trainerClassKeys.all, 'current-session'] as const,
  stats: () => [...trainerClassKeys.all, 'stats'] as const,
  byDate: (date: Date) => [...trainerClassKeys.all, 'by-date', date.toISOString().split('T')[0]] as const,
  byRange: (startDate: Date, endDate: Date) => {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return [...trainerClassKeys.all, 'by-range', start.toISOString().split('T')[0], end.toISOString().split('T')[0]] as const;
  },
  locations: () => [...trainerClassKeys.all, 'locations'] as const,
};


export function useTrainerClasses(filters?: CalendarFilters & {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: trainerClassKeys.list(filters),
    queryFn: async () => {
      try {
        return await TrainerClassService.getMyClasses(filters);
      } catch (error) {
        console.error('Error fetching trainer classes:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


export function useTrainerClass(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.detail(classId),
    queryFn: () => TrainerClassService.getClassById(classId),
    enabled: !!classId,
    staleTime: 30 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
  });
}


export function useClassMembers(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.members(classId),
    queryFn: () => TrainerClassService.getClassMembers(classId),
    enabled: !!classId,
  });
}


export function useClassSessions(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.sessions(classId),
    queryFn: () => TrainerClassService.getClassSessions(classId),
    enabled: !!classId,
  });
}


export function useCurrentSession() {
  return useQuery({
    queryKey: trainerClassKeys.currentSession(),
    queryFn: () => TrainerClassService.getCurrentSession(),
    refetchInterval: 30000, 
  });
}


export function useTrainerStats() {
  return useQuery({
    queryKey: trainerClassKeys.stats(),
    queryFn: () => TrainerClassService.getTrainerStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: false,
  });
}


export function useClassesByDate(date: Date) {
  return useQuery({
    queryKey: trainerClassKeys.byDate(date),
    queryFn: () => TrainerClassService.getClassesByDate(date),
    enabled: !!date,
  });
}


export function useClassesByDateRange(
  startDate: Date, 
  endDate: Date, 
  filters?: CalendarFilters
) {
  const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
  const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
  
  const filtersStr = filters ? JSON.stringify(filters) : 'none';
  
  return useQuery({
    queryKey: ['trainer-classes', 'by-range', startDateStr, endDateStr, filtersStr],
    queryFn: () => {
      return TrainerClassService.getClassesByDateRange(startDate, endDate, filters);
    },
    enabled: !!startDate && !!endDate,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    refetchInterval: false,
  });
}


export function useStartClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StartClassDTO) => {
      const result = await TrainerClassService.startClass(data);
      return result;
    },
    onSuccess: async (_session, variables) => {
      queryClient.setQueryData(trainerClassKeys.all, (oldData: any) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;
        return oldData.map((item: any) => {
          if (item.id === variables.classId) {
            return { ...item, status: 'in_progress' };
          }
          return item;
        });
      });
      

      const cache = queryClient.getQueryCache();
      const queries = cache.findAll({ 
        queryKey: ['trainer-classes', 'by-range'],
        exact: false 
      });
      
      queries.forEach(query => {
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((item: any) => {
            if (item.id === variables.classId) {
              return { ...item, status: 'in_progress' };
            }
            return item;
          });
        });
      });

      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: trainerClassKeys.all,
          refetchType: 'active'
        }),
        queryClient.invalidateQueries({ queryKey: trainerClassKeys.stats(), refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: trainerClassKeys.detail(variables.classId), refetchType: 'active' }),
      ]);
      
      toast.success('Clase iniciada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al iniciar la clase';
      toast.error(errorMessage);
    },
  });
}


export function useEndClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EndClassDTO) => TrainerClassService.endClass(data),
    onSuccess: async (_session, variables) => {
      queryClient.setQueryData(trainerClassKeys.all, (oldData: any) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;
        return oldData.map((item: any) => {
          if (item.id === variables.sessionId) {
            return { ...item, status: 'completed' };
          }
          return item;
        });
      });
      
      const cache = queryClient.getQueryCache();
      const queries = cache.findAll({ 
        queryKey: ['trainer-classes', 'by-range'],
        exact: false 
      });
      
      queries.forEach(query => {
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((item: any) => {
            if (item.id === variables.sessionId) {
              return { ...item, status: 'completed' };
            }
            return item;
          });
        });
      });
      
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: trainerClassKeys.all,
          refetchType: 'active'
        }),
        queryClient.invalidateQueries({ queryKey: trainerClassKeys.stats(), refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: trainerClassKeys.detail(variables.sessionId), refetchType: 'active' }),
      ]);
      
      toast.success('Clase finalizada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al finalizar la clase';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendanceDTO) => TrainerClassService.updateAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.currentSession() });
      toast.success('Asistencia actualizada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar asistencia';
      toast.error(errorMessage);
    },
  });
}


export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, memberId, status, notes }: {
      sessionId: string;
      memberId: string;
      status: 'present' | 'absent' | 'late';
      notes?: string;
    }) => TrainerClassService.markAttendance(sessionId, memberId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.currentSession() });
      toast.success('Asistencia marcada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al marcar asistencia';
      toast.error(errorMessage);
    },
  });
}


export function useCancelClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, reason }: { classId: string; reason?: string }) => 
      TrainerClassService.cancelClass(classId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.all });
      toast.success('Clase cancelada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al cancelar la clase';
      toast.error(errorMessage);
    },
  });
}


export function useAvailableLocations() {
  return useQuery({
    queryKey: trainerClassKeys.locations(),
    queryFn: () => TrainerClassService.getAvailableLocations(),
    staleTime: 30 * 60 * 1000, 
  });
}


export function useCalendarPrefetching() {
  const queryClient = useQueryClient();

  const prefetchNextWeek = (currentDate: Date) => {
    const nextWeekStart = new Date(currentDate);
    nextWeekStart.setDate(currentDate.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(nextWeekStart, nextWeekEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(nextWeekStart, nextWeekEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchPreviousWeek = (currentDate: Date) => {
    const prevWeekStart = new Date(currentDate);
    prevWeekStart.setDate(currentDate.getDate() - 7);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekStart.getDate() + 7);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(prevWeekStart, prevWeekEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(prevWeekStart, prevWeekEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchNextMonth = (currentDate: Date) => {
    const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const nextMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(nextMonthStart, nextMonthEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(nextMonthStart, nextMonthEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchPreviousMonth = (currentDate: Date) => {
    const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(prevMonthStart, prevMonthEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(prevMonthStart, prevMonthEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchClassDetails = (classId: string) => {
    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.detail(classId),
      queryFn: () => TrainerClassService.getClassById(classId),
      staleTime: 30 * 1000,
    });
  };

 
  const prefetchHeaderData = (currentDate: Date) => {
    
    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.stats(),
      queryFn: () => TrainerClassService.getTrainerStats(),
      staleTime: 5 * 60 * 1000,
    });

    
    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byDate(currentDate),
      queryFn: () => TrainerClassService.getClassesByDate(currentDate),
      staleTime: 60 * 1000,
    });
  };

  return {
    prefetchNextWeek,
    prefetchPreviousWeek,
    prefetchNextMonth,
    prefetchPreviousMonth,
    prefetchClassDetails,
    prefetchHeaderData,
  };
}
