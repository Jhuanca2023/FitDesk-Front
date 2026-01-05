import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  AttendanceSession,
  AttendanceRecord,
  AttendanceSummary,
  MemberAttendanceHistory,
  CreateAttendanceSessionDTO,
  UpdateAttendanceDTO,
  CompleteAttendanceSessionDTO,
  BulkAttendanceUpdateDTO,
  AttendanceSearchParams,
  PaginatedAttendanceResponse,
  ApiResponse
} from '../types';

class AttendanceService {
  private readonly baseUrl = '/trainer/attendance';

  async getAttendanceSessions(params?: AttendanceSearchParams): Promise<PaginatedAttendanceResponse<AttendanceSession>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    if (params?.filters?.dateRange) {
      searchParams.append('startDate', params.filters.dateRange.start.toISOString());
      searchParams.append('endDate', params.filters.dateRange.end.toISOString());
    }
    if (params?.filters?.status) searchParams.append('status', params.filters.status);
    if (params?.filters?.classId) searchParams.append('classId', params.filters.classId);
    if (params?.filters?.location) searchParams.append('location', params.filters.location);
    if (params?.filters?.searchTerm) searchParams.append('search', params.filters.searchTerm);

    const response = await fitdeskApi.get<PaginatedAttendanceResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions?${searchParams.toString()}`
    );
    return response.data;
  }

  async getAttendanceSession(sessionId: string): Promise<AttendanceSession> {
    const response = await fitdeskApi.get<ApiResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions/${sessionId}`
    );
    return response.data.data;
  }

  async getSessionsByDate(date: Date): Promise<AttendanceSession[]> {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fitdeskApi.get<ApiResponse<AttendanceSession[]>>(
      `${this.baseUrl}/sessions/by-date/${dateStr}`
    );
    return response.data.data;
  }

  async getSessionsByClass(classId: string, params?: AttendanceSearchParams): Promise<PaginatedAttendanceResponse<AttendanceSession>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await fitdeskApi.get<PaginatedAttendanceResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions/by-class/${classId}?${searchParams.toString()}`
    );
    return response.data;
  }

  async createAttendanceSession(data: CreateAttendanceSessionDTO): Promise<AttendanceSession> {
    const response = await fitdeskApi.post<ApiResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions`,
      data
    );
    return response.data.data;
  }

  async updateAttendance(data: UpdateAttendanceDTO): Promise<AttendanceSession> {
    const response = await fitdeskApi.patch<ApiResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions/${data.sessionId}/attendance`,
      { attendanceRecords: data.attendanceRecords }
    );
    return response.data.data;
  }

  async bulkUpdateAttendance(data: BulkAttendanceUpdateDTO): Promise<AttendanceSession> {
    const response = await fitdeskApi.patch<ApiResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions/${data.sessionId}/bulk-attendance`,
      { updates: data.updates }
    );
    return response.data.data;
  }

  async completeAttendanceSession(data: CompleteAttendanceSessionDTO): Promise<AttendanceSession> {
    const response = await fitdeskApi.patch<ApiResponse<AttendanceSession>>(
      `${this.baseUrl}/sessions/${data.sessionId}/complete`,
      { endTime: data.endTime, notes: data.notes }
    );
    return response.data.data;
  }

  async markAttendance(sessionId: string, memberId: string, status: 'present' | 'absent' | 'late' | 'excused', notes?: string): Promise<AttendanceRecord> {
    const response = await fitdeskApi.patch<ApiResponse<AttendanceRecord>>(
      `${this.baseUrl}/sessions/${sessionId}/members/${memberId}`,
      { 
        status, 
        checkInTime: status === 'present' || status === 'late' ? new Date() : undefined,
        notes 
      }
    );
    return response.data.data;
  }

  async getAttendanceSummary(params?: { 
    dateRange?: { start: Date; end: Date }; 
    classId?: string; 
  }): Promise<AttendanceSummary> {
    const searchParams = new URLSearchParams();
    
    if (params?.dateRange) {
      searchParams.append('startDate', params.dateRange.start.toISOString());
      searchParams.append('endDate', params.dateRange.end.toISOString());
    }
    if (params?.classId) searchParams.append('classId', params.classId);

    const response = await fitdeskApi.get<ApiResponse<AttendanceSummary>>(
      `${this.baseUrl}/summary?${searchParams.toString()}`
    );
    return response.data.data;
  }

  async getMemberAttendanceHistory(params?: AttendanceSearchParams): Promise<PaginatedAttendanceResponse<MemberAttendanceHistory>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    if (params?.filters?.dateRange) {
      searchParams.append('startDate', params.filters.dateRange.start.toISOString());
      searchParams.append('endDate', params.filters.dateRange.end.toISOString());
    }
    if (params?.filters?.classId) searchParams.append('classId', params.filters.classId);
    if (params?.filters?.searchTerm) searchParams.append('search', params.filters.searchTerm);

    const response = await fitdeskApi.get<PaginatedAttendanceResponse<MemberAttendanceHistory>>(
      `${this.baseUrl}/members/history?${searchParams.toString()}`
    );
    return response.data;
  }

  async getMemberHistory(memberId: string, params?: { 
    dateRange?: { start: Date; end: Date }; 
    classId?: string; 
  }): Promise<MemberAttendanceHistory> {
    const searchParams = new URLSearchParams();
    
    if (params?.dateRange) {
      searchParams.append('startDate', params.dateRange.start.toISOString());
      searchParams.append('endDate', params.dateRange.end.toISOString());
    }
    if (params?.classId) searchParams.append('classId', params.classId);

    const response = await fitdeskApi.get<ApiResponse<MemberAttendanceHistory>>(
      `${this.baseUrl}/members/${memberId}/history?${searchParams.toString()}`
    );
    return response.data.data;
  }

  async exportAttendanceReport(format: 'pdf' | 'excel' | 'csv', params?: AttendanceSearchParams): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append('format', format);
    
    if (params?.filters?.dateRange) {
      searchParams.append('startDate', params.filters.dateRange.start.toISOString());
      searchParams.append('endDate', params.filters.dateRange.end.toISOString());
    }
    if (params?.filters?.classId) searchParams.append('classId', params.filters.classId);
    if (params?.filters?.location) searchParams.append('location', params.filters.location);

    const response = await fitdeskApi.get(
      `${this.baseUrl}/export?${searchParams.toString()}`,
      { responseType: 'blob' }
    );
    return response.data as Blob;
  }

  async getQuickStats(): Promise<{
    todaySessions: number;
    todayAttendance: number;
    weeklyAverage: number;
    monthlyTotal: number;
  }> {
    const response = await fitdeskApi.get<ApiResponse<{
      todaySessions: number;
      todayAttendance: number;
      weeklyAverage: number;
      monthlyTotal: number;
    }>>(`${this.baseUrl}/quick-stats`);
    return response.data.data;
  }
}

export const attendanceService = new AttendanceService();
