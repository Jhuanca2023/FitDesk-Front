import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { ClassRequest, ClassResponse, Class, CalendarClassDTO } from '../types/class';

export class ClassService {
  private static readonly ENDPOINT = '/classes/classes';

  static async getAll(): Promise<Class[]> {
    try {
      const { data } = await fitdeskApi.get<ClassResponse[]>(ClassService.ENDPOINT);
      return data.map(ClassService.mapResponseToClass);
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  static async getCalendarClasses(startDate?: string, endDate?: string): Promise<CalendarClassDTO[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await fitdeskApi.get<CalendarClassDTO[]>(`${ClassService.ENDPOINT}/calendar?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching calendar classes:', error);
      throw error;
    }
  }

  static async getUpcomingClasses(): Promise<CalendarClassDTO[]> {
    try {
      const { data } = await fitdeskApi.get<CalendarClassDTO[]>(`${ClassService.ENDPOINT}/upcoming`);
      return data;
    } catch (error) {
      console.error('Error fetching upcoming classes:', error);
      throw error;
    }
  }


  static async getClassesForCalendar(): Promise<Class[]> {
    try {
      const { data } = await fitdeskApi.get<ClassResponse[]>(ClassService.ENDPOINT);
      return data.map(ClassService.mapResponseToClass);
    } catch (error) {
      console.error('Error fetching classes for calendar:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Class> {
    try {
      const { data } = await fitdeskApi.get<ClassResponse>(`${ClassService.ENDPOINT}/${id}`);
      return ClassService.mapResponseToClass(data);
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    }
  }

  static async create(classData: ClassRequest): Promise<Class> {
    try {
      const { data } = await fitdeskApi.post<ClassResponse>(ClassService.ENDPOINT, classData);
      return ClassService.mapResponseToClass(data);
    } catch (error) {
      console.error('❌ Error creating class:', error);
      throw error;
    }
  }

  static async update(id: string, updateData: Partial<ClassRequest>): Promise<Class> {
    try {
      const { data } = await fitdeskApi.put<ClassResponse>(`${ClassService.ENDPOINT}/${id}`, updateData);
      return ClassService.mapResponseToClass(data);
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await fitdeskApi.delete(`${ClassService.ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }


  private static mapResponseToClass(response: ClassResponse): Class {
    return {
      id: response.id,
      className: response.className,
      locationName: response.locationName,
      trainerName: response.trainerName,
      classDate: response.classDate,
      duration: response.duration,
      maxCapacity: response.maxCapacity,
      schedule: response.schedule,
      active: response.active,
      description: response.description,
    };
  }

  static mapClassToRequest(classData: Partial<Class>): ClassRequest {
    return {
      className: classData.className || '',
      locationId: '',
      trainerId: '',
      classDate: classData.classDate || '',
      duration: classData.duration || 60,
      maxCapacity: classData.maxCapacity || 1,
      startTime: '',
      endTime: '',
      active: classData.active ?? true,
      description: classData.description,
    };
  }
}
