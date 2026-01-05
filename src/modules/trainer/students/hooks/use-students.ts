import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '../services/student.service';
import { useStudentsStore } from '../store/students-store';
import type { 
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentStatus,
  StudentFilters,
  Student,
  PaginatedResponse
} from '../types';

export function useStudents() {
  const queryClient = useQueryClient();
  const { 
    filters, 
    pagination, 
    setFilters, 
    setPagination, 
    setStudents, 
    updateStudentStatus 
  } = useStudentsStore();

  const { 
    data: studentsData, 
    isLoading, 
    isError,
    refetch: refreshStudents
  } = useQuery({
    queryKey: ['students', filters, pagination],
    queryFn: async () => {
      try {
        const response = await studentService.getStudents(filters, pagination) as PaginatedResponse<Student>;
        
        const adaptedStudents = response.data.map(student => {
          // Ensure all required fields have default values
          const defaultMembership = {
            type: 'BASIC' as const,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: student.status === 'ACTIVE' ? 'ACTIVE' as const : 'EXPIRED' as const,
          };
          
          return {
            id: student.id,
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.email || '',
            phone: student.phone || '',
            profileImage: student.profileImage || '',
            status: student.status || 'INACTIVE',
            joinDate: student.joinDate || new Date().toISOString(),
            lastActivity: student.lastActivity || new Date().toISOString(),
            membership: {
              ...defaultMembership,
              ...student.membership,
              type: student.membership?.type || defaultMembership.type,
              status: student.status === 'ACTIVE' ? 'ACTIVE' as const : 'EXPIRED' as const,
            },
            stats: {
              totalClasses: student.stats?.totalClasses || 0,
              attendedClasses: student.stats?.attendedClasses || 0,
              attendanceRate: student.stats?.attendanceRate || 0,
              currentStreak: student.stats?.currentStreak || 0,
              longestStreak: student.stats?.longestStreak || 0,
            },
            createdAt: student.createdAt || new Date().toISOString(),
            updatedAt: student.updatedAt || new Date().toISOString()
          };
        });

        return {
          ...response,
          data: adaptedStudents
        };
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    retry: 1, 
    refetchOnWindowFocus: false,
  });
  
  const students = studentsData?.data || [];
  

  const createStudentMutation = useMutation({
    mutationFn: async (studentData: CreateStudentDTO) => {
      return await studentService.createStudent(studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante agregado exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al agregar estudiante';
      toast.error(errorMessage);
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStudentDTO }) => {
      return await studentService.updateStudent(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar estudiante';
      toast.error(errorMessage);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StudentStatus }) => {
      updateStudentStatus(id, status);
      return await studentService.updateStudentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estado actualizado exitosamente');
    },
    onError: (error: unknown, { id, status }) => {
      updateStudentStatus(id, status);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar estado';
      toast.error(errorMessage);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      await studentService.deleteStudent(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al eliminar estudiante';
      toast.error(errorMessage);
    },
  });

  const updateFilters = (newFilters: Partial<StudentFilters>) => {
    setFilters(newFilters);
  };

  const updatePagination = (updates: Partial<{ page: number; limit: number }>) => {
    setPagination(updates);
  };

  return {
    students,
    pagination,
    filters,
    
    isLoading,
    isError,
    
    refreshStudents,
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteStudent: deleteStudentMutation.mutateAsync,
    
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteStudentMutation.isPending,
    
    createError: createStudentMutation.error,
    updateError: updateStudentMutation.error,
    deleteError: deleteStudentMutation.error,
    
    updateFilters,
    updatePagination,
  };
}

export function useStudent(studentId?: string) {
  const queryClient = useQueryClient();
  
  const { 
    data: student, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      return await studentService.getStudentById(studentId);
    },
    enabled: !!studentId,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDTO }) => 
      studentService.updateStudent(id, data),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.setQueryData(['student', updatedStudent.id], updatedStudent);
      toast.success('Estudiante actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar estudiante';
      toast.error(errorMessage);
    },
  });
  
  return {
    student,
    isLoading,
    error,
    refetch,
    updateStudent: updateStudentMutation.mutateAsync,
    isUpdating: updateStudentMutation.isPending,
  };
}
