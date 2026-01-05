import { z } from 'zod';
import {
  TrainerPersonalDataSchema,
  SecuritySessionSchema,
  TrainerConfigurationSchema,
} from '@/core/zod';



export type TrainerPersonalData = z.infer<typeof TrainerPersonalDataSchema>;
export type SecuritySession = z.infer<typeof SecuritySessionSchema>;
export type TrainerConfiguration = z.infer<typeof TrainerConfigurationSchema>;



export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeactivateAccountDTO {
  reason: string;
  feedback?: string;
}

export interface DeleteAccountDTO {
  password: string;
  reason: string;
  feedback?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SecurityCheckResponse {
  hasWeakPassword: boolean;
  hasUnusualActivity: boolean;
  hasUnverifiedDevices: boolean;
  lastPasswordChange: string;
  recommendedActions: string[];
}


export type ConfigurationSection =
  | 'personal-data'
  | 'account-control'
  | 'password-security'
  ;

export interface ConfigurationTab {
  id: ConfigurationSection;
  title: string;
  description: string;
  icon: string;
}
