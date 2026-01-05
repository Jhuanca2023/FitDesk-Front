import { fitdeskApi } from '../../../../core/api/fitdeskApi';
import type { Trainer, TrainerFormData } from '../types';
import { securityService, type TrainerRegistrationRequest, type TrainerRegistrationResponse } from './security.service';


export type { TrainerRegistrationRequest, TrainerRegistrationResponse } from './security.service';


interface TrainerResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  phone: string;
  email: string;
  address: string;
  profileImageUrl?: string;
  specialties: string;
  yearsOfExperience: number;
  certifications: string[];
  availability: string[];
  hireDate: string;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'RETIRADO';
  contractType: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'INDEPENDIENTE' | 'TEMPORAL';
  salaryPerClass: number;
  bankInfo?: string;
  notes?: string;
}

function mapTrainerResponse(response: TrainerResponseDTO): Trainer {
  const mapped = {
    id: response.id,
    firstName: response.firstName,
    lastName: response.lastName,
    documentNumber: response.dni,
    birthDate: response.birthDate,
    gender: response.gender === 'MASCULINO' ? 'MALE' as const : response.gender === 'FEMENINO' ? 'FEMALE' as const : 'OTHER' as const,
    phone: response.phone,
    email: response.email,
    address: response.address,
    profileImage: response.profileImageUrl,
    specialties: response.specialties,
    yearsOfExperience: response.yearsOfExperience,
    certifications: response.certifications ? response.certifications.join(', ') : '',
    certificationImages: response.certifications || [],
    availability: response.availability ? response.availability.reduce((acc, day) => {
    
      const dayMap: Record<string, string> = {
        'LUNES': 'Lunes',
        'MARTES': 'Martes', 
        'MIERCOLES': 'Miércoles',
        'JUEVES': 'Jueves',
        'VIERNES': 'Viernes',
        'SABADO': 'Sábado',
        'DOMINGO': 'Domingo'
      };
      const mappedDay = dayMap[day] || day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      acc[mappedDay] = true;
      return acc;
    }, {} as Record<string, boolean>) : {},
    joinDate: response.hireDate,
    status: response.status === 'ACTIVO' ? 'ACTIVE' as const : response.status === 'INACTIVO' ? 'INACTIVE' as const : 'SUSPENDED' as const,
    contractType: response.contractType === 'TIEMPO_COMPLETO' ? 'FULL_TIME' as const : 
                  response.contractType === 'MEDIO_TIEMPO' ? 'PART_TIME' as const :
                  response.contractType === 'INDEPENDIENTE' ? 'FREELANCE' as const : 'PER_HOUR' as const,
    salary: response.salaryPerClass,
    bankInfo: response.bankInfo,
    notes: response.notes
  };
  return mapped;
}

interface TrainerFilters {
  searchTerm?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const trainerService = {
  async getAll(filters: TrainerFilters = {}): Promise<PaginatedResponse<Trainer>> {
    const params = new URLSearchParams();
    
    if (filters.page !== undefined) {
      params.append('page', (filters.page - 1).toString());
    }
    if (filters.limit !== undefined) {
      params.append('size', filters.limit.toString());
    }
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }

    const response = await fitdeskApi.get(`/classes/trainers?${params.toString()}`);
    
    
    const pageData = response.data as {
      content: TrainerResponseDTO[];
      number: number;
      size: number;
      totalElements: number;
      totalPages: number;
    };
    const trainers = pageData.content.map(mapTrainerResponse);
    
    return {
      data: trainers,
      pagination: {
        page: pageData.number + 1,
        limit: pageData.size,
        total: pageData.totalElements,
        totalPages: pageData.totalPages
      }
    };
  },

  async getById(id: string): Promise<Trainer> {
    const response = await fitdeskApi.get(`/classes/trainers/${id}`);
    return mapTrainerResponse(response.data as TrainerResponseDTO);
  },

  async createBasicTrainer(trainerData: TrainerRegistrationRequest): Promise<TrainerRegistrationResponse> {
    return await securityService.registerTrainer(trainerData);
  },

  async create(trainer: FormData): Promise<Trainer> {
    const response = await fitdeskApi.post('/classes/trainers', trainer, {
      timeout: 60000,
    });
    return mapTrainerResponse(response.data as TrainerResponseDTO);
  },

  async update(id: string, trainer: Partial<TrainerFormData> | FormData): Promise<Trainer> {
    const isFormData = trainer instanceof FormData;
    
    try {
      console.log('Actualizando entrenador:', { id, isFormData, hasProfileImage: isFormData && trainer.has('profileImage') });
      
      const response = await fitdeskApi.put(
        `/classes/trainers/${id}`,
        trainer,
        {
          // Evitar forzar Content-Type en FormData para que el boundary sea correcto
          headers: isFormData 
            ? undefined
            : { 'Content-Type': 'application/json' },
          timeout: isFormData ? 60000 : 10000,
        }
      );
      
      console.log('Entrenador actualizado exitosamente');
      return mapTrainerResponse(response.data as TrainerResponseDTO);
    } catch (error) {
      console.error('Error al actualizar entrenador:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await fitdeskApi.delete(`/classes/trainers/${id}`);
  },

};
