import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/student.service';
import type { 
  ClassStudent, 
  ClassMetrics, 
  Class, 
  StudentFilters, 
  PaginationOptions, 
  PaginatedResponse 
} from '../types';
import { useStudentsStore } from '../store/students-store';

export function useTrainerClasses() {
  return useQuery<PaginatedResponse<Class>, Error>({
    queryKey: ['trainer', 'classes'],
    queryFn: async (): Promise<PaginatedResponse<Class>> => {
      console.log('🔍 [useTrainerClasses] Iniciando obtención de clases...');
      try {
        const data = await studentService.getClasses();
        console.log('✅ [useTrainerClasses] Clases obtenidas correctamente. Total:', data?.data?.length || 0);
        if (data?.data) {
          console.log('📋 [useTrainerClasses] IDs de clases:', data.data.map((c: Class) => c.id).join(', '));
        } else {
          console.warn('⚠️ [useTrainerClasses] No se recibieron datos de clases');
        }
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('❌ [useTrainerClasses] Error al obtener clases:', {
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Remove onError and onSettled as they're not valid in this version of react-query
  });
}

export function useClassStudents(
  classId: string, 
  filters?: StudentFilters, 
  pagination?: PaginationOptions
) {
  const { filters: globalFilters, pagination: globalPagination } = useStudentsStore();
  
  const effectiveFilters = { ...globalFilters, ...filters };
  const effectivePagination = { ...globalPagination, ...pagination };

  return useQuery<PaginatedResponse<ClassStudent>>({
    queryKey: ['class', classId, 'students', effectiveFilters, effectivePagination],
    queryFn: () => studentService.getStudentsByClass(classId, effectiveFilters, effectivePagination),
    enabled: !!classId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useClassMetrics(classId: string) {
  return useQuery<ClassMetrics>({
    queryKey: ['class', classId, 'metrics'],
    queryFn: () => studentService.getClassMetrics(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClassDetails(classId: string) {
  return useQuery<Class>({
    queryKey: ['class', classId],
    queryFn: () => studentService.getClassById(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
