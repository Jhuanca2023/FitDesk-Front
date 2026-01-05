import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { locationService } from '../services/location.service';
import type { LocationRequest, Location } from '../types/location';

interface LocationFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface LocationResponse {
  data: Location[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useLocations(filters: LocationFilters = {}) {
  const queryClient = useQueryClient();


  const prefetchLocations = async (page: number) => {
    const nextPageFilters = { ...filters, page };
    await queryClient.prefetchQuery<LocationResponse>({
      queryKey: ['locations', nextPageFilters],
      queryFn: () => locationService.getAll(nextPageFilters),
      staleTime: 5 * 60 * 1000,
    });
  };


  useEffect(() => {
    const nextPage = (filters.page || 1) + 1;
    prefetchLocations(nextPage).catch(console.error);
  }, [filters, prefetchLocations]);

  const { 
    data: response = { 
      data: [], 
      pagination: { 
        page: 1, 
        limit: 10, 
        total: 0, 
        totalPages: 0 
      } 
    }, 
    isLoading, 
    error
  } = useQuery<LocationResponse>({
    queryKey: ['locations', filters],
    queryFn: async () => {
      try {
        console.log('Fetching locations from API with filters:', filters);
        const result = await locationService.getAll(filters);
        return result;
      } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
  
  const { data: locations = [], pagination } = response;

  const createMutation = useMutation({
    mutationFn: async (data: LocationRequest) => {
      const result = await locationService.create(data);
      if (!result) {
        throw new Error('Failed to create location');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LocationRequest }) => {
      const result = await locationService.update(id, data);
      if (!result) {
        throw new Error('Failed to update location');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const success = await locationService.delete(id);
      if (!success) {
        throw new Error('Failed to delete location');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const result = await locationService.toggleStatus(id, isActive);
      if (!result) {
        throw new Error('Failed to update location status');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  return {
    locations,
    pagination,
    isLoading,
    error,
    createLocation: createMutation.mutateAsync,
    updateLocation: updateMutation.mutateAsync,
    deleteLocation: deleteMutation.mutateAsync,
    toggleLocationStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
}
