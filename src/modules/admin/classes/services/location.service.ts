import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { LocationRequest, LocationResponse, Location } from '../types/location';

const BASE_URL = '/classes/locations';

interface LocationFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


interface SpringPageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}

export const locationService = {
  async getAll(filters: LocationFilters = {}): Promise<{ data: Location[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      if (filters.page !== undefined) params.append('page', (filters.page - 1).toString());
      if (filters.limit !== undefined) params.append('size', filters.limit.toString());
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.status === 'active') params.append('active', 'true');
      if (filters.status === 'inactive') params.append('active', 'false');

      const response = await fitdeskApi.get<SpringPageResponse<LocationResponse>>(`${BASE_URL}?${params.toString()}`);
      
      return {
        data: response.data.content.map(this.mapResponseToLocation),
        pagination: {
          page: response.data.pageable.pageNumber + 1,
          limit: response.data.pageable.pageSize,
          total: response.data.totalElements,
          totalPages: response.data.totalPages,
        }
      };
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      return { 
        data: [], 
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } 
      };
    }
  },

  async getById(id: string): Promise<Location | null> {
    if (!id) return null;
    try {
      const response = await fitdeskApi.get<LocationResponse>(`${BASE_URL}/${id}`);
      return this.mapResponseToLocation(response.data);
    } catch (error) {
      console.error(`Failed to fetch location ${id}:`, error);
      return null;
    }
  },

  async create(data: LocationRequest): Promise<Location | null> {
    try {
      const response = await fitdeskApi.post<LocationResponse>(BASE_URL, data);
      return this.mapResponseToLocation(response.data);
    } catch (error) {
      console.error('Failed to create location:', error);
      return null;
    }
  },

  async update(id: string, data: LocationRequest): Promise<Location | null> {
    if (!id) return null;
    try {
      const response = await fitdeskApi.put<LocationResponse>(`${BASE_URL}/${id}`, data);
      return this.mapResponseToLocation(response.data);
    } catch (error) {
      console.error(`Failed to update location ${id}:`, error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    try {
      await fitdeskApi.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete location ${id}:`, error);
      return false;
    }
  },

  async toggleStatus(id: string, isActive: boolean): Promise<Location | null> {
    if (!id) return null;
    try {
      // Primero obtener los datos actuales de la ubicación
      const currentLocation = await this.getById(id);
      if (!currentLocation) return null;
      
      // Actualizar solo el estado activo, manteniendo los demás campos
      const updateData = {
        name: currentLocation.name,
        description: currentLocation.description,
        ability: currentLocation.capacity, // Mantener la capacidad actual
        active: isActive // Solo esto cambia
      };
      
      const response = await fitdeskApi.put<LocationResponse>(`${BASE_URL}/${id}`, updateData);
      return this.mapResponseToLocation(response.data);
    } catch (error) {
      console.error(`Error al cambiar estado de la ubicación ${id}:`, error);
      return null;
    }
  },

 
  mapResponseToLocation(response: LocationResponse): Location {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      capacity: response.ability,
      isActive: response.active,
    };
  },


  mapLocationToRequest(location: Partial<Location>): LocationRequest {
    return {
      name: location.name || '',
      description: location.description,
      ability: location.capacity || 1,
      active: location.isActive ?? true,
    };
  }
};
