import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  TrainerConfiguration,
  TrainerPersonalData,
  SecuritySession,
  SecurityCheckResponse,
  ChangePasswordDTO,
  DeactivateAccountDTO,
  ApiResponse,
} from '../types';

class ConfigurationService {
  private readonly baseUrl = '/trainer/configuration';


  async getPersonalData(): Promise<TrainerPersonalData> {
    const response = await fitdeskApi.get<ApiResponse<TrainerPersonalData>>(`${this.baseUrl}/personal-data`);
    return response.data.data;
  }

  
  async deactivateAccount(data: DeactivateAccountDTO): Promise<string> {
    const response = await fitdeskApi.post<ApiResponse<null>>(`${this.baseUrl}/deactivate`, data);
    return response.data.message;
  }


  async getSecurityCheck(): Promise<SecurityCheckResponse> {
    const response = await fitdeskApi.get<ApiResponse<SecurityCheckResponse>>(`${this.baseUrl}/security-check`);
    return response.data.data;
  }

  async getActiveSessions(): Promise<SecuritySession[]> {
    const response = await fitdeskApi.get<ApiResponse<SecuritySession[]>>(`${this.baseUrl}/sessions`);
    return response.data.data;
  }

  async terminateSession(sessionId: string): Promise<string> {
    const response = await fitdeskApi.delete<ApiResponse<null>>(`${this.baseUrl}/sessions/${sessionId}`);
    return response.data.message;
  }

  async changePassword(data: ChangePasswordDTO): Promise<string> {
   
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
   
    try {
      await fitdeskApi.get(`/security/auth/status`);
    } catch {}
    const response = await fitdeskApi.post<ApiResponse<null>>(`/security/auth/change-password`, payload);
    return response.data.message;
  }

 
  async getConfiguration(): Promise<TrainerConfiguration> {
    const response = await fitdeskApi.get<ApiResponse<TrainerConfiguration>>(`${this.baseUrl}`);
    return response.data.data;
  }
}

export const configurationService = new ConfigurationService();
