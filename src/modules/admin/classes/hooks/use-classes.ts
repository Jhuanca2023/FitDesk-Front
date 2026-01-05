import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ClassService } from '../services/class.service';
import type { Class, ClassRequest } from '../types/class';

export const useClasses = () => {
  const queryClient = useQueryClient();
  
  const result = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const data = await ClassService.getAll();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['classes-calendar'],
      queryFn: async () => {
        const data = await ClassService.getClassesForCalendar();
        return Array.isArray(data) ? data : [];
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);
  
  return result;
};


export const useClassesForCalendar = () => {
  const queryClient = useQueryClient();
  
  const result = useQuery<Class[]>({
    queryKey: ['classes-calendar'],
    queryFn: async () => {
      const data = await ClassService.getClassesForCalendar();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['classes'],
      queryFn: async () => {
        const data = await ClassService.getAll();
        return Array.isArray(data) ? data : [];
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);
  
  return result;
};

export const useClass = (id: string) => {
  const queryClient = useQueryClient();
  
  const result = useQuery<Class>({
    queryKey: ['class', id],
    queryFn: () => ClassService.getById(id),
    enabled: !!id
  });

  useEffect(() => {
    if (result.data && id) {
      queryClient.setQueryData(['class', id], result.data);
    }
  }, [result.data, id, queryClient]);
  
  return result;
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Class, Error, ClassRequest>({
    mutationFn: ClassService.create,
    onSuccess: () => {
      // Invalidar ambas queries para que se actualicen inmediatamente
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes-calendar'] });
    }
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Class, Error, { id: string; data: Partial<ClassRequest> }>({
    mutationFn: ({ id, data }) => ClassService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['class', id] });
    }
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: ClassService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes-calendar'] });
    }
  });
};
