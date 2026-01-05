import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Trainer, TrainerFormData } from '../types';
import { trainerService } from '../services/trainer.service';

interface TrainerFilters {
  searchTerm?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useTrainers = (filters: TrainerFilters = {}) => {
  const queryClient = useQueryClient();

  
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['trainers', filters],
    queryFn: () => trainerService.getAll(filters),
    initialData: { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }
  });

  
  const trainers = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

  
  const createTrainerMutation = useMutation<Trainer, Error, FormData>({
    mutationFn: (data) => trainerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Entrenador creado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al crear entrenador:', error);
      toast.error('Error al crear el entrenador');
    },
  });

 
  const updateTrainerMutation = useMutation<Trainer, Error, { id: string; data: FormData | Partial<TrainerFormData> }>({
    mutationFn: ({ id, data }) => trainerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: ['trainer'] });
      toast.success('Entrenador actualizado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al actualizar entrenador:', error);
      toast.error('Error al actualizar el entrenador');
    },
  });

  
  const deleteTrainerMutation = useMutation<void, Error, string>({
    mutationFn: (id) => trainerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Entrenador eliminado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al eliminar entrenador:', error);
      toast.error('Error al eliminar el entrenador');
    },
  });

  return {
    trainers,
    pagination,
    isLoading,
    error,
    createTrainer: createTrainerMutation.mutateAsync,
    updateTrainer: updateTrainerMutation.mutateAsync,
    deleteTrainer: deleteTrainerMutation.mutateAsync,
  };
};

export const useTrainer = (id?: string) => {
  const { data: trainer, isLoading, error } = useQuery<Trainer>({
    queryKey: ['trainer', id],
    queryFn: () => id ? trainerService.getById(id) : Promise.reject(new Error('ID no proporcionado')),
    enabled: !!id,
  });

  return { trainer, isLoading, error };
};

// Hook específico para obtener trainers para selects
export const useTrainersForSelect = () => {
  const { trainers, isLoading, error } = useTrainers({ limit: 1000 }); // Obtener todos los trainers
  
  const trainersForSelect = trainers.map(trainer => ({
    id: trainer.id,
    value: trainer.id,
    label: `${trainer.firstName} ${trainer.lastName}`,
    name: `${trainer.firstName} ${trainer.lastName}`,
    specialties: trainer.specialties
  }));

  return {
    trainers: trainersForSelect,
    isLoading,
    error
  };
};