import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { 
  TrainerClass, 
  ClassSession, 
  CalendarFilters,
  StartClassDTO,
  EndClassDTO,
  UpdateAttendanceDTO,
  ClassMember
} from '../types';

interface TrainerClassFilters extends CalendarFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class TrainerClassService {
  private static readonly ENDPOINT = '/classes';
  private static readonly STATS_ENDPOINT = '/classes/stadistic';
  private static readonly CLASSES_ENDPOINT = '/classes/classes';


  static async getMyClasses(_filters?: TrainerClassFilters): Promise<TrainerClass[]> {
    return [];
  }

 
  static async getClassesByDateRange(startDate: Date, endDate: Date, filters?: CalendarFilters): Promise<TrainerClass[]> {
    const response = await fitdeskApi.get<any[]>(
      `${this.STATS_ENDPOINT}/my-classes/stats`
    );
    
    const mappedClasses: TrainerClass[] = response.data.map((classData: any) => {
      const [day, month, year] = classData.classDate.split('-');
      const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
      
      const [startHour, startMinute] = classData.startTime.split(':');
      const [endHour, endMinute] = classData.endTime.split(':');
      
      const startDateTime = new Date(classDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
      
      const endDateTime = new Date(classDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute));
      
 
      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
      
      
      let status = 'scheduled';
      
  
      const statusMap: Record<string, string> = {
        'PROGRAMADA': 'scheduled',
        'Activa': 'scheduled', 
        'EN_PROCESO': 'in_progress',
        'COMPLETADA': 'completed',
        'CANCELADA': 'cancelled'
      };
      
      status = statusMap[classData.status] || 'scheduled';
      
      return {
        id: classData.id,
        name: classData.className,
        description: classData.description || '',
        dayOfWeek: this.getDayOfWeekFromDate(classDate),
        classDate: classDate,
        startTime: classData.startTime,
        duration: duration,
        capacity: classData.maxCapacity,
        location: classData.locationName,
        status: status as any,
        enrolledCount: classData.currentStudents,
        enrolledMembers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    
    let filteredClasses = mappedClasses.filter(c => {
      const classDate = new Date(c.classDate);

      const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      const classDateStr = `${classDateOnly.getFullYear()}-${String(classDateOnly.getMonth() + 1).padStart(2, '0')}-${String(classDateOnly.getDate()).padStart(2, '0')}`;
      const startDateStr = `${startDateOnly.getFullYear()}-${String(startDateOnly.getMonth() + 1).padStart(2, '0')}-${String(startDateOnly.getDate()).padStart(2, '0')}`;
      const endDateStr = `${endDateOnly.getFullYear()}-${String(endDateOnly.getMonth() + 1).padStart(2, '0')}-${String(endDateOnly.getDate()).padStart(2, '0')}`;
      
      const isInRange = classDateStr >= startDateStr && classDateStr <= endDateStr;
      return isInRange;
    });
    
    if (filters?.status) {
      filteredClasses = filteredClasses.filter(c => c.status === filters.status);
    }
    
    if (filters?.location) {
      filteredClasses = filteredClasses.filter(c => c.location === filters.location);
    }
    
    return filteredClasses;
  }
  
  private static getDayOfWeekFromDate(date: Date): any {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  }

  
  static async getClassById(classId: string): Promise<TrainerClass> {
    const response = await fitdeskApi.get<any>(`${this.STATS_ENDPOINT}/${classId}/detail`);
    
   
    const [day, month, year] = response.data.classDate.split('-');
    const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const [startHour, startMinute] = response.data.startTime.split(':');
    const [endHour, endMinute] = response.data.endTime.split(':');
    
    const startDateTime = new Date(classDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    
    const endDateTime = new Date(classDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute));
    
    const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    
    const students = response.data.students || [];
    
    const uniqueStudents = students.map((student: any) => ({
      id: String(student.memberId || student.id || ''),
      name: student.name,
      email: student.email,
      phone: student.phone,
      avatar: student.profileImageUrl,
      enrolledAt: new Date(),
      attendanceStatus: student.attendanceStatus
    }));
    

    const statusMap: Record<string, string> = {
      'PROGRAMADA': 'scheduled',
      'Activa': 'scheduled',
      'EN_PROCESO': 'in_progress',
      'COMPLETADA': 'completed',
      'CANCELADA': 'cancelled'
    };
    
    const status = statusMap[response.data.status] || 'scheduled';
    
    return {
      id: response.data.id,
      name: response.data.className,
      description: response.data.description || '',
      dayOfWeek: this.getDayOfWeekFromDate(classDate),
      classDate: classDate,
      startTime: response.data.startTime,
      duration: duration,
      capacity: response.data.maxCapacity,
      location: response.data.locationName,
      status: status as any,
      enrolledCount: uniqueStudents.length,
      enrolledMembers: uniqueStudents,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

 
  static async getClassMembers(classId: string): Promise<ClassMember[]> {
    const response = await fitdeskApi.get<ClassMember[]>(`${this.ENDPOINT}/${classId}/members`);
    return response.data;
  }

 
  static async getClassSessions(classId: string): Promise<ClassSession[]> {
    const response = await fitdeskApi.get<ClassSession[]>(`${this.ENDPOINT}/${classId}/sessions`);
    return response.data;
  }

  static async getClassDetails(classId: string): Promise<{ status: string }> {
    try {
      const response = await fitdeskApi.get<any>(`${this.STATS_ENDPOINT}/${classId}/detail`);
      return {
        status: response.data.status
      };
    } catch (error) {
      throw new Error('No se pudieron obtener los detalles de la clase');
    }
  }

  
  static async startClass(startData: StartClassDTO): Promise<ClassSession> {
    try {
      const classDetails = await this.getClassDetails(startData.classId);
      
      if (classDetails.status === 'EN_PROCESO' || classDetails.status === 'Activa') {
        return {
          id: startData.classId,
          classId: startData.classId,
          date: startData.sessionDate,
          startTime: new Date(),
          status: 'in_progress' as any,
          attendees: [],
          notes: startData.notes
        };
      }
      
      if (classDetails.status !== 'PROGRAMADA' && classDetails.status !== 'Activa') {
        throw new Error(`No se puede iniciar la clase. Estado actual: ${classDetails.status}`);
      }
      
      const response = await fitdeskApi.patch<any>(`${this.CLASSES_ENDPOINT}/${startData.classId}/start`);
      
      const statusMap: Record<string, string> = {
        'PROGRAMADA': 'scheduled',
        'Activa': 'scheduled',
        'EN_PROCESO': 'in_progress',
        'COMPLETADA': 'completed',
        'CANCELADA': 'cancelled'
      };
      
      const status = statusMap[response.data.status] || 'scheduled';
      
      return {
        id: response.data.id,
        classId: startData.classId,
        date: startData.sessionDate,
        startTime: new Date(),
        status: status as any,
        attendees: [],
        notes: startData.notes
      };
    } catch (error) {
      throw error;
    }
  }

  
  static async endClass(endData: EndClassDTO): Promise<ClassSession> {
    const classId = endData.sessionId;
    
    const attendanceStatusMap: Record<string, string> = {
      'present': 'PRESENTE',
      'absent': 'AUSENTE',
      'late': 'TARDE'
    };
    
    const attendanceData: Record<string, string> = {};
    endData.attendees.forEach(attendee => {
      attendanceData[attendee.memberId] = attendanceStatusMap[attendee.status] || 'AUSENTE';
    });
    
    const response = await fitdeskApi.patch<any>(
      `${this.CLASSES_ENDPOINT}/${classId}/complete`,
      attendanceData
    );
    
    return {
      id: response.data.id,
      classId: classId,
      date: new Date(),
      startTime: new Date(),
      endTime: endData.endTime,
      status: 'completed' as any,
      attendees: endData.attendees,
      notes: endData.notes
    };
  }

 
  static async updateAttendance(attendanceData: UpdateAttendanceDTO): Promise<ClassSession> {
    const response = await fitdeskApi.patch<ClassSession>(`${this.ENDPOINT}/update-attendance`, attendanceData);
    return response.data;
  }

  
  static async getCurrentSession(): Promise<ClassSession | null> {
    try {
      const response = await fitdeskApi.get<ClassSession>(`${this.ENDPOINT}/current-session`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null; 
        }
      }
      throw error;
    }
  }


  static async cancelClass(classId: string, reason?: string): Promise<void> {
    await fitdeskApi.patch(`${this.CLASSES_ENDPOINT}/${classId}/cancel`, { reason });
  }

 
  static async getTrainerStats(): Promise<{
    totalClasses: number;
    completedClasses: number;
    scheduledClasses: number;
    totalStudents: number;
    averageAttendance: number;
    upcomingClasses: number;
  }> {
    const response = await fitdeskApi.get<any[]>(`${this.STATS_ENDPOINT}/my-classes/stats`);
    const classes = response.data;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const classesThisMonth = classes.filter((c: any) => {
      if (!c.classDate) return false;
      const [day, month, year] = c.classDate.split('-');
      const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return classDate.getMonth() === currentMonth && classDate.getFullYear() === currentYear;
    });
    
    const normalizeStatus = (status: string) => {
      if (!status) return '';
      const normalized = status.toUpperCase().trim();
      if (normalized === 'PROGRAMADA' || normalized === 'ACTIVA' || normalized === 'SCHEDULED') return 'PROGRAMADA';
      if (normalized === 'COMPLETADA' || normalized === 'COMPLETED') return 'COMPLETADA';
      if (normalized === 'EN_PROCESO' || normalized === 'IN_PROGRESS') return 'EN_PROCESO';
      if (normalized === 'CANCELADA' || normalized === 'CANCELLED') return 'CANCELADA';
      return normalized;
    };
    
    const totalClasses = classesThisMonth.filter((c: any) => 
      normalizeStatus(c.status) !== 'CANCELADA'
    ).length;
    
    const scheduledClasses = classes.filter((c: any) => {
      const status = normalizeStatus(c.status);
      const isScheduled = status === 'PROGRAMADA' || status === 'ACTIVA';
      
      if (isScheduled && c.classDate) {
        const [day, month, year] = c.classDate.split('-');
        const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
        return classDateOnly >= today;
      }
      
      return false;
    }).length;
    
    const completedClasses = classesThisMonth.filter((c: any) => 
      normalizeStatus(c.status) === 'COMPLETADA'
    ).length;
    const totalStudents = classes.reduce((sum: number, c: any) => sum + (c.currentStudents || 0), 0);
    const avgAttendance = classes.length > 0 
      ? classes.reduce((sum: number, c: any) => sum + (c.averageAttendance || 0), 0) / classes.length
      : 0;
    
    const upcomingClasses = classes.filter((c: any) => {
      if (!c.classDate) return false;
      
      const [day, month, year] = c.classDate.split('-');
      const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
      
      const isFuture = classDateOnly >= today;
      const isNotCompletedOrCancelled = c.status !== 'COMPLETADA' && c.status !== 'CANCELADA';
      
      return isFuture && isNotCompletedOrCancelled;
    }).length;
    
    return {
      totalClasses,
      completedClasses,
      scheduledClasses,
      totalStudents,
      averageAttendance: avgAttendance,
      upcomingClasses
    };
  }

 
  static async getClassesByDate(date: Date): Promise<TrainerClass[]> {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fitdeskApi.get<TrainerClass[]>(`${this.ENDPOINT}/date/${dateStr}`);
    return response.data;
  }

 
  static async markAttendance(
    sessionId: string, 
    memberId: string, 
    status: 'present' | 'absent' | 'late', 
    notes?: string
  ): Promise<void> {
    await fitdeskApi.patch(`${this.ENDPOINT}/sessions/${sessionId}/attendance`, {
      memberId,
      status,
      notes
    });
  }

  static async saveAttendance(classId: string, attendanceData: Record<string, string>): Promise<void> {
    await fitdeskApi.post(`${this.CLASSES_ENDPOINT}/${classId}/save-attendance`, attendanceData);
  }

  
  static async getAvailableLocations(): Promise<string[]> {
    return [];
  }
}
