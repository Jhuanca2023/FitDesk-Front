import { fitdeskApi } from "@/core/api/fitdeskApi";


export interface MemberDashboardDTO {
  inClass: boolean;
  remainingClasses: number;
  nextClassName: string;
  nextClassTime: string;
  consecutiveDays: number;
  weeklyActivity: WeeklyActivityDTO[];
  upcomingClasses: UpcomingClassDTO[];
}

export interface WeeklyActivityDTO {
  day: string;
  classes: number;
  completed: number;
}

export interface UpcomingClassDTO {
  id: string;
  className: string;
  schedule: string;
  trainerName: string;
  locationName: string;
}

export interface CalendarClassDTO {
  id: string;
  className: string;
  schedule: string;
  trainerName: string;
  locationName: string;
  capacity: string;
  date: string;
}

export class DashboardService {

  static async getDashboardMember(): Promise<MemberDashboardDTO> {
    try {
      const response = await fitdeskApi.get<MemberDashboardDTO>(`/dashboard/member`);
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo dashboard del miembro:", error);
      throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener el dashboard");
    }
  }

  static async getClassesCalendar(startDate?: string, endDate?: string): Promise<CalendarClassDTO[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fitdeskApi.get(`/stadistic/calendar?${params.toString()}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("Error obteniendo calendario de clases:", error);
      throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener el calendario");
    }
  }


  static async getUpcomingClasses(): Promise<UpcomingClassDTO[]> {
    try {
      const response = await fitdeskApi.get(`/stadistic/upcoming`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("Error obteniendo próximas clases:", error);
      throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las próximas clases");
    }
  }
}
