import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { ClientClass, ClassFilters, PaginatedResponse } from '../types';


export interface ClassReservationResponse {
  reservationId: string;
  classId: string;
  className: string;
  trainerName: string;
  schedule: string;
  locationName: string;
  capacity: string; 
  action: string;
  alreadyReserved: boolean;
  completed: boolean;
}

export class ClientClassesService {

  
  private static mapReservationToClientClass(reservation: ClassReservationResponse): ClientClass {
    
    const capacityMatch = reservation.capacity.match(/(\d+)\/(\d+)/);
    const currentParticipants = capacityMatch ? parseInt(capacityMatch[1]) : 0;
    const maxParticipants = capacityMatch ? parseInt(capacityMatch[2]) : 0;
    

    let status: 'upcoming' | 'pending' | 'completed' | 'cancelled';
    const backendStatus = reservation.action;
    
    if (backendStatus === 'COMPLETADO') {
      status = 'completed';
    } else if (backendStatus === 'PENDIENTE') {
      status = 'pending';
    } else if (backendStatus === 'CANCELADO') {
      status = 'cancelled';
    } else {
      status = 'upcoming';
    }

    
    const scheduleTime = reservation.schedule.split(' - ')[0];
    
    return {
      id: reservation.classId,
      reservationId: reservation.reservationId,
      title: reservation.className,
      description: '',
      trainer: {
        id: '',
        name: reservation.trainerName,
        avatar: ''
      },
      location: reservation.locationName,
      date: new Date().toISOString().split('T')[0],
      time: scheduleTime,
      duration: 60,
      maxParticipants,
      currentParticipants,
      status,
      canConfirm: status === 'upcoming',
      canCancel: status === 'upcoming' || status === 'pending',
      price: 0
    };
  }

  static async getAll(filters?: ClassFilters): Promise<PaginatedResponse<ClientClass>> {
    try {
      const response = await fitdeskApi.get(`/classes/reservations/my`);
      const reservations: ClassReservationResponse[] = Array.isArray(response.data) ? response.data : [];
      

      let clientClasses = reservations.map(this.mapReservationToClientClass);
      
 
      if (filters?.status && filters.status !== 'all') {
        clientClasses = clientClasses.filter(cls => cls.status === filters.status);
      }
      
      return {
        data: clientClasses,
        pagination: {
          page: 1,
          limit: clientClasses.length,
          total: clientClasses.length,
          totalPages: 1
        }
      };
    } catch (error: any) {
      console.error('Error fetching client classes:', error);
      if (error.response?.status === 204) {
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0
          }
        };
      }
      throw error;
    }
  }


  static async getById(id: string): Promise<ClientClass> {
    try {
      const response = await fitdeskApi.get(`/classes/reservations/my`);
      const reservations: ClassReservationResponse[] = Array.isArray(response.data) ? response.data : [];
      const reservation = reservations.find(r => r.classId === id);
      
      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }
      
      return this.mapReservationToClientClass(reservation);
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  }


  static async bookClass(classId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.post('/classes/reservations', {
        classId: classId
      });
      return { success: true, message: 'Clase reservada exitosamente' };
    } catch (error) {
      console.error('Error booking class:', error);
      throw error;
    }
  }


  static async cancelReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.delete(`/classes/reservations/${reservationId}`);
      return { success: true, message: 'Reserva cancelada exitosamente' };
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  }


  static async confirmAttendance(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.put(`/classes/reservations/${reservationId}/confirm`);
      return { success: true, message: 'Asistencia confirmada exitosamente' };
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  }


  static async cancelClass(classId: string): Promise<{ success: boolean; message: string }> {
    try {

      const response = await fitdeskApi.get('/classes/reservations/my');
      const reservations: ClassReservationResponse[] = Array.isArray(response.data) ? response.data : [];
      const reservation = reservations.find(r => r.classId === classId);
      
      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }
      
      return await this.cancelReservation(reservation.reservationId);
    } catch (error) {
      console.error('Error canceling class:', error);
      throw error;
    }
  }


  static async completeReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.put(`/classes/reservations/${reservationId}/complete`);
      return { success: true, message: 'Clase completada exitosamente' };
    } catch (error) {
      console.error('Error completing reservation:', error);
      throw error;
    }
  }
}
