import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '../services/student.service';
import { useStudentsStore } from '../store/students-store';
import { z } from 'zod';

export function useStudentMetrics() {
  const queryClient = useQueryClient();
  const { 
    metrics, 
    attendanceHistory, 
    setMetrics, 
    setAttendanceHistory,
    addAttendanceRecord 
  } = useStudentsStore();
  
  
  const { 
    isLoading: isLoadingMetrics, 
    error: metricsError,
    refetch: refreshMetrics
  } = useQuery({
    queryKey: ['student-metrics'],
    queryFn: async () => {
      try {
        const response = await studentService.getMetrics();
        
     
        const metricsSchema = z.object({
          totalStudents: z.number(),
          activeStudents: z.number(),
          inactiveStudents: z.number(),
          averageAttendanceRate: z.number(),
          totalClassesThisMonth: z.number(),
          newStudentsThisMonth: z.number(),
          weeklyStats: z.array(z.object({
            week: z.string(),
            totalClasses: z.number(),
            averageAttendance: z.number(),
          })),
          topStudents: z.array(z.object({
            student: z.object({
              id: z.string(),
              firstName: z.string(),
              lastName: z.string(),
              profileImage: z.string().optional(),
            }),
            attendanceRate: z.number(),
            totalClasses: z.number(),
          })),
          weeklyTrends: z.array(z.object({
            name: z.string(),
            value: z.number(),
            positive: z.number(),
            negative: z.number(),
          })).optional(),
        });
        
        const validatedMetrics = metricsSchema.parse(response);
        setMetrics(validatedMetrics);
        return validatedMetrics;
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setMetrics(null);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  
  const { 
    isLoading: isLoadingAttendance,
    error: attendanceError,
    refetch: refreshAttendance
  } = useQuery({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      try {
        const result = await studentService.getAttendanceHistory();
        setAttendanceHistory(result.data || []);
        return result;
      } catch (error) {
        console.error('Error fetching attendance history:', error);
        setAttendanceHistory([]);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, 
    gcTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

 
  const useAttendanceStats = (period: 'week' | 'month' | 'quarter' | 'year' = 'month', studentId?: string) => {
    return useQuery({
      queryKey: ['attendance-stats', period, studentId],
      queryFn: async () => {
        //  datosvacíos hasta que se implemente en el backend
        return {
          totalClasses: 0,
          attendedClasses: 0,
          attendanceRate: 0,
          period
        };
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  
  const markAttendanceMutation = useMutation({
    mutationFn: async ({ 
      studentId, 
      classId, 
      status, 
      notes 
    }: { 
      studentId: string; 
      classId: string; 
      status: 'present' | 'absent' | 'late' | 'excused';
      notes?: string;
    }) => {
      return await studentService.markAttendance(studentId, classId, status, notes);
    },
    onSuccess: (newRecord) => {
    
      addAttendanceRecord(newRecord);
      
     
      queryClient.invalidateQueries({ queryKey: ['student-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      
      toast.success('Asistencia registrada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al registrar asistencia';
      toast.error(errorMessage);
    },
  });

 
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      studentId, 
      message 
    }: { 
      studentId: string; 
      message: {
        subject: string;
        content: string;
        type: 'email' | 'sms' | 'notification';
      };
    }) => {
      return await studentService.sendMessage(studentId, message);
    },
    onSuccess: () => {
      toast.success('Mensaje enviado exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al enviar mensaje';
      toast.error(errorMessage);
    },
  });

  return {
    
    metrics,
    attendanceHistory,
    
   
    isLoadingMetrics,
    isLoadingAttendance,
    isLoading: isLoadingMetrics || isLoadingAttendance,
    metricsError,
    attendanceError,
    
    
    refreshMetrics,
    refreshAttendance,
    markAttendance: markAttendanceMutation.mutateAsync,
    sendMessage: sendMessageMutation.mutateAsync,
    isMarkingAttendance: markAttendanceMutation.isPending,
    isSendingMessage: sendMessageMutation.isPending,
    useAttendanceStats,
  };
}
