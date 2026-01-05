import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { configurationService } from '../services/configuration.service';
import type {
  ChangePasswordDTO,
  DeactivateAccountDTO,
  DeleteAccountDTO
} from '../types';


export const configurationKeys = {
  all: ['trainer-configuration'] as const,
  personalData: () => [...configurationKeys.all, 'personal-data'] as const,
  securityCheck: () => [...configurationKeys.all, 'security-check'] as const,
  sessions: () => [...configurationKeys.all, 'sessions'] as const,
};


export const usePersonalData = () => {
  return useQuery({
    queryKey: configurationKeys.personalData(),
    queryFn: () => configurationService.getPersonalData(),
    staleTime: 5 * 60 * 1000,
  });
};


export const useSecurityCheck = () => {
  return useQuery({
    queryKey: configurationKeys.securityCheck(),
    queryFn: () => configurationService.getSecurityCheck(),
    staleTime: 2 * 60 * 1000,
  });
};




export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordDTO) => configurationService.changePassword(data),
    onSuccess: (message) => {
      toast.success(message || 'Contraseña cambiada correctamente');
      queryClient.invalidateQueries({ queryKey: configurationKeys.securityCheck() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as any)?.response?.data?.message
        : 'Error al cambiar contraseña';
      toast.error(errorMessage);
    },
  });
};




export const useTerminateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => configurationService.terminateSession(sessionId),
    onSuccess: (message) => {
      toast.success(message || 'Sesión terminada correctamente');
      queryClient.invalidateQueries({ queryKey: configurationKeys.sessions() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as any)?.response?.data?.message
        : 'Error al terminar sesión';
      toast.error(errorMessage);
    },
  });
};






