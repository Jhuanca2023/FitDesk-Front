import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  Student,
  Class,
  PaginatedResponse,
  StudentMetrics,
  AttendanceRecord,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentStatus,
  StudentFilters,
  PaginationOptions,
  ApiResponse,
  ClassStudent,
  ClassMetrics,
  ClassStatus,
  MembershipType
} from '../types';

// Actualizar las URLs base para que coincidan con el backend
const BASE_URL = '/api/trainer/students';
const CLASSES_URL = '/classes/stadistic';

export const studentService = {
  
  async getClasses(): Promise<PaginatedResponse<Class>> {
    const endpoint = `${CLASSES_URL}/my-classes/stats`;
    console.log(`📡 [getClasses] Solicitando clases del entrenador en: ${endpoint}`);
    
    try {
      // Log the full URL being called
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
      console.log(`🌐 [getClasses] URL completa: ${baseUrl}${endpoint}`);
      
      const response = await fitdeskApi.get<Array<{
        id: string;
        className: string;
        description: string;
        currentStudents: number;
        maxCapacity: number;
        trainerName: string;
        locationName: string;
        classDate: string;
        startTime: string;
        endTime: string;
        schedule: string;
        averageAttendance: number;
        active: boolean;
        status: string;
      }>>(endpoint);

      console.log('✅ [getClasses] Datos de clases recibidos. Cantidad:', response?.data?.length || 0);
      console.log('📊 [getClasses] Ejemplo de clase recibida:', response?.data?.[0] || 'No hay datos');

      if (!response.data || !Array.isArray(response.data)) {
        console.error('❌ [getClasses] La respuesta no contiene un array de clases:', response);
        return {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };
      }

      // Mapear la respuesta del backend a la interfaz Class
      const classesData: Class[] = response.data.map(cls => {
        console.log(`📝 [getClasses] Procesando clase: ${cls.className} (ID: ${cls.id})`);
        
        // Ensure the status is one of the valid ClassStatus values
        const getClassStatus = (isActive: boolean): ClassStatus => {
          return isActive ? 'ACTIVE' : 'INACTIVE';
        };
        
        const classStatus = getClassStatus(cls.active);
        
        return {
          id: cls.id,
          name: cls.className,
          type: 'GROUP' as const, // Use const assertion for type safety
          description: cls.description,
          status: classStatus,
          schedule: [{
            dayOfWeek: 0, // Por defecto, se puede extraer del schedule si es necesario
            startTime: cls.startTime,
            endTime: cls.endTime,
            duration: 60 // Valor por defecto
          }],
          maxCapacity: cls.maxCapacity,
          currentEnrollment: cls.currentStudents,
          enrolledStudents: [], // Se cargarán bajo demanda
          trainer: {
            id: '', // No disponible en la respuesta
            name: cls.trainerName
          },
          location: cls.locationName,
          startDate: cls.classDate,
          endDate: '', // No disponible en la respuesta
          createdAt: '', // No disponible en la respuesta
          updatedAt: '', // No disponible en la respuesta
          stats: {
            totalSessions: 0, // No disponible en la respuesta
            averageAttendance: cls.averageAttendance,
            completionRate: 0 // No disponible en la respuesta
          }
        };
      });

      console.log(`✅ [getClasses] Se mapearon ${classesData.length} clases correctamente`);

      return {
        data: classesData,
        total: classesData.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(classesData.length / 10) || 1
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      const errorResponse = error && 
                         typeof error === 'object' && 
                         'response' in error && 
                         error.response && 
                         typeof error.response === 'object' ? {
        status: (error.response as any).status,
        statusText: (error.response as any).statusText,
        data: (error.response as any).data
      } : 'No response data';
      
      console.error('❌ [getClasses] Error al obtener las clases:', {
        error: errorMessage,
        endpoint,
        response: errorResponse,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Return empty data structure on error to prevent UI crashes
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  async getClassById(classId: string): Promise<Class> {
    try {
      console.log(`[getClassById] Solicitando detalles de la clase ${classId}...`);
      const response = await fitdeskApi.get<{
        id: string;
        className: string;
        description: string;
        currentStudents: number;
        maxCapacity: number;
        trainerName: string;
        locationName: string;
        classDate: string;
        startTime: string;
        endTime: string;
        schedule: string;
        active: boolean;
        status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'COMPLETED';
        students: Array<{
          memberId: string;
          name: string;
          email: string;
          avatarInitials: string;
          status: string;
          membershipType: 'REGULAR' | 'PREMIUM' | 'TRIAL' | 'INACTIVE';
          attendancePercentage: number;
          totalClasses: number;
          lastAccess: string | null;
          reservationId: string;
        }>;
      }>(`${CLASSES_URL}/${classId}/detail`);

      const classData = response.data;
      console.log(`[getClassById] Datos recibidos para la clase ${classId}:`, classData);

      return {
        id: classData.id,
        name: classData.className,
        type: 'GROUP' as const, // Use const assertion for type safety
        description: classData.description,
        status: classData.active ? 'ACTIVE' : 'INACTIVE',
        schedule: [{
          dayOfWeek: 0, // Por defecto, se puede extraer del schedule si es necesario
          startTime: classData.startTime,
          endTime: classData.endTime,
          duration: 60 // Valor por defecto
        }],
        maxCapacity: classData.maxCapacity,
        currentEnrollment: classData.currentStudents,
        enrolledStudents: classData.students.map(student => ({
          id: student.memberId,
          firstName: student.name.split(' ')[0],
          lastName: student.name.split(' ').slice(1).join(' '),
          email: student.email,
          phone: '', // No disponible en la respuesta
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`,
          status: (student.status as StudentStatus) || 'INACTIVE',
          joinDate: '', // No disponible en la respuesta
          lastActivity: student.lastAccess || '',
          membership: {
            type: (student.membershipType as MembershipType) || 'MONTHLY',
            startDate: '', // No disponible en la respuesta
            endDate: '', // No disponible en la respuesta
            status: student.status as 'ACTIVE' | 'EXPIRED' | 'SUSPENDED'
          },
          stats: {
            totalClasses: student.totalClasses,
            attendedClasses: Math.round((student.attendancePercentage / 100) * student.totalClasses),
            attendanceRate: student.attendancePercentage,
            currentStreak: 0, // No disponible en la respuesta
            longestStreak: 0 // No disponible en la respuesta
          },
          createdAt: '', // No disponible en la respuesta
          updatedAt: '' // No disponible en la respuesta
        })),
        trainer: {
          id: '', // No disponible en la respuesta
          name: classData.trainerName
        },
        location: classData.locationName,
        startDate: classData.classDate,
        endDate: '', // No disponible en la respuesta
        createdAt: '', // No disponible en la respuesta
        updatedAt: '', // No disponible en la respuesta
        stats: {
          totalSessions: 0, // No disponible en la respuesta
          averageAttendance: 0, // Se puede calcular si es necesario
          completionRate: 0 // No disponible en la respuesta
        }
      };
    } catch (error) {
      console.error(`Error al obtener la clase:`, error);
      throw error;
    }
  },


  async getStudentsByClass(classId: string, filters?: StudentFilters, pagination?: PaginationOptions): Promise<PaginatedResponse<ClassStudent>> {
    const endpoint = `${CLASSES_URL}/${classId}/detail`;
    
    try {
      console.log(`[getStudentsByClass] Fetching students for class ${classId} from ${endpoint}`);
      const response = await fitdeskApi.get<{
        id: string;
        students: Array<{
          memberId: string;
          name: string;
          email: string;
          avatarInitials: string;
          status: string;
          membershipType: string;
          attendancePercentage: number;
          totalClasses: number;
          lastAccess: string | null;
          reservationId: string;
        }>;
      }>(endpoint);

      // Filter students based on status if provided
      let students = response.data.students;
      if (filters?.status?.length) {
        students = students.filter(student => 
          filters.status?.includes(student.status as StudentStatus)
        );
      }

      // Map the response to ClassStudent format
      const mappedStudents: ClassStudent[] = students.map(student => ({
        id: student.memberId,
        firstName: student.name.split(' ')[0],
        lastName: student.name.split(' ').slice(1).join(' '),
        email: student.email,
        phone: '',
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`,
        attendanceStatus: (student as any).attendanceStatus || 'present', // Campo del backend
        totalClasses: student.totalClasses,
        attendedClasses: Math.round((student.attendancePercentage / 100) * student.totalClasses),
        attendanceRate: student.attendancePercentage,
        membershipStatus: student.status as 'ACTIVE' | 'EXPIRED' | 'SUSPENDED',
        membershipType: student.membershipType as MembershipType,
        joinDate: '',
        lastAttended: student.lastAccess || '',
        notes: ''
      }));

      // Apply pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedStudents = mappedStudents.slice(startIndex, startIndex + limit);

      return {
        data: paginatedStudents,
        total: mappedStudents.length,
        page,
        limit,
        totalPages: Math.ceil(mappedStudents.length / limit)
      };
    } catch (error) {
      console.error(`[getStudentsByClass] Error fetching students for class ${classId}:`, error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  async getClassMetrics(classId: string): Promise<ClassMetrics> {
    try {
      console.log(`[getClassMetrics] Fetching metrics for class ${classId}`);
      const response = await fitdeskApi.get<{
        totalClasses: number;
        completedClasses: number;
        totalStudents: number;
        averageAttendance: number;
        upcomingClasses: number;
        classesThisMonth: number;
        attendanceChange: number;
        studentTrends: Array<{
          week: string;
          activeStudents: number;
          inactiveStudents: number;
          label: string;
        }>;
      }>('/classes/dashboard/trainer');

      // Create empty arrays for the required properties
      const emptyUpcomingClasses: Array<{
        id: string;
        name: string;
        date: string;
        time: string;
        location: string;
        registeredStudents: number;
        capacity: number;
      }> = [];

      // Map the response to ClassMetrics format
      return {
        classId: classId,
        className: '', // You might want to fetch this from the class details
        totalStudents: response.data.totalStudents,
        averageAttendance: response.data.averageAttendance,
        attendanceTrend: [], // Add empty array for attendanceTrend
        attendanceByDay: [], // Add empty array for attendanceByDay
        recentActivity: [], // Add empty array for recentActivity
        topStudents: [], // Add empty array for topStudents
        upcomingClasses: emptyUpcomingClasses, // Use the empty array with correct type
      };
    } catch (error) {
      console.error(`[getClassMetrics] Error fetching metrics for class ${classId}:`, error);
      return {
        classId: classId,
        className: '',
        totalStudents: 0,
        averageAttendance: 0,
        attendanceTrend: [],
        attendanceByDay: [],
        recentActivity: [],
        topStudents: [],
        upcomingClasses: []
      };
    }
  },

  async getStudents(filters?: StudentFilters, pagination?: PaginationOptions): Promise<PaginatedResponse<Student>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.membershipType?.length) params.append('membershipType', filters.membershipType.join(','));
    if (filters?.attendanceRate) {
      params.append('attendanceRateMin', filters.attendanceRate.min.toString());
      params.append('attendanceRateMax', filters.attendanceRate.max.toString());
    }
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
    if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);
    
    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const { data } = await fitdeskApi.get<PaginatedResponse<Student>>(url);
    return data;
  },

  async getMetrics(): Promise<StudentMetrics> {
    const { data } = await fitdeskApi.get<StudentMetrics>(`${BASE_URL}/metrics`);
    return data;
  },

 
  async getStudentById(id: string): Promise<Student> {
    const { data } = await fitdeskApi.get<Student>(`${BASE_URL}/${id}`);
    return data;
  },

  async createStudent(studentData: CreateStudentDTO): Promise<Student> {
    const { data } = await fitdeskApi.post<Student>(`${BASE_URL}`, studentData);
    return data;
  },

  async updateStudent(id: string, studentData: UpdateStudentDTO): Promise<Student> {
    const { data } = await fitdeskApi.put<Student>(`${BASE_URL}/${id}`, studentData);
    return data;
  },

  async updateStudentStatus(id: string, status: StudentStatus): Promise<Student> {
    const { data } = await fitdeskApi.patch<Student>(`${BASE_URL}/${id}/status`, { status });
    return data;
  },

  async deleteStudent(id: string): Promise<void> {
    await fitdeskApi.delete(`${BASE_URL}/${id}`);
  },

  async getAttendanceHistory(): Promise<PaginatedResponse<AttendanceRecord>> {
    const { data } = await fitdeskApi.get<PaginatedResponse<AttendanceRecord>>(`${BASE_URL}/attendance`);
    return data;
  },

  async markAttendance(studentId: string, classId: string, status: string, notes?: string): Promise<AttendanceRecord> {
    const { data } = await fitdeskApi.post<AttendanceRecord>(`${BASE_URL}/${studentId}/attendance`, {
      classId,
      status,
      notes
    });
    return data;
  },

  async sendMessage(studentId: string, message: { subject: string; content: string; type: string }): Promise<ApiResponse<void>> {
    const { data } = await fitdeskApi.post<ApiResponse<void>>(`${BASE_URL}/${studentId}/message`, message);
    return data;
  }
};
