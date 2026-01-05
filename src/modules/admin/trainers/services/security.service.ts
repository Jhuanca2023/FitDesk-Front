import { fitdeskApi } from '../../../../core/api/fitdeskApi';

export interface TrainerRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
}

export interface TrainerRegistrationResponse {
  id: string;
  email: string;
  message: string;
}

export const securityService = {
  async registerTrainer(request: TrainerRegistrationRequest): Promise<TrainerRegistrationResponse> {
    const response = await fitdeskApi.post('/security/admin/users/register-trainer', request);
    return response.data as TrainerRegistrationResponse;
  }
};
