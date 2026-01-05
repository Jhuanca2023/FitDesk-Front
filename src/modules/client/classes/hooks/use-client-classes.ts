import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ClientClassesService } from '../services/client-classes.service';
import type { ClassFilters } from '../types';


const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || 'Ha ocurrido un error inesperado';
  }
  return 'Ha ocurrido un error inesperado';
};


export const clientClassesKeys = {
  all: ['client-classes'] as const,
  classes: (filters?: ClassFilters) => [...clientClassesKeys.all, 'classes', filters] as const,
  class: (id: string) => [...clientClassesKeys.all, 'class', id] as const
};


export function useClientClasses(filters?: ClassFilters) {
  return useQuery({
    queryKey: clientClassesKeys.classes(filters),
    queryFn: () => ClientClassesService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000 
  });
}


export function useClientClass(id: string) {
  return useQuery({
    queryKey: clientClassesKeys.class(id),
    queryFn: () => ClientClassesService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
}

export function useConfirmAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => 
      ClientClassesService.confirmAttendance(reservationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientClassesKeys.all });
      
  
      toast.success(data.message || 'Asistencia confirmada correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error confirming attendance:', error);
      toast.error(getErrorMessage(error));
    }
  });
}


export function useCancelClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => 
      ClientClassesService.cancelClass(classId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientClassesKeys.all });
      toast.success(data.message || 'Clase cancelada correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error canceling class:', error);
      toast.error(getErrorMessage(error));
    }
  });
}


export function useBookClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => 
      ClientClassesService.bookClass(classId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientClassesKeys.all });
      toast.success(data.message || 'Clase reservada correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error booking class:', error);
      toast.error(getErrorMessage(error));
    }
  });
}

export function useCompleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => 
      ClientClassesService.completeReservation(reservationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientClassesKeys.all });
      toast.success(data.message || 'Clase completada correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error completing reservation:', error);
      toast.error(getErrorMessage(error));
    }
  });
}
