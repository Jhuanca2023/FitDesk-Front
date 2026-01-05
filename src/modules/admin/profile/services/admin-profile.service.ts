import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { AdminProfile, Activity, Statistic } from '../types';

export class AdminProfileService {
  static async getAdminProfile(): Promise<AdminProfile> {
    const response = await fitdeskApi.get<AdminProfile>('/');
    return response.data;
  }

  static async updateAdminProfile(profile: Partial<AdminProfile>): Promise<AdminProfile> {
    const response = await fitdeskApi.put<AdminProfile>('/', profile);
    return response.data;
  }

  static async getRecentActivity(): Promise<Activity[]> {
    const response = await fitdeskApi.get<Activity[]>('/');
    return response.data;
  }

  static async getStatistics(): Promise<Statistic[]> {
    const response = await fitdeskApi.get<Statistic[]>('/');
    return response.data;
  }
}
