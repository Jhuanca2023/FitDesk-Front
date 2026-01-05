import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminProfile, Activity, Statistic } from '../types';
import { AdminProfileService } from '../services/admin-profile.service';

export const ADMIN_PROFILE_QUERY_KEY = 'adminProfile';
export const ADMIN_ACTIVITY_QUERY_KEY = 'adminActivity';
export const ADMIN_STATISTICS_QUERY_KEY = 'adminStatistics';

export const useAdminProfile = () => {
  return useQuery<AdminProfile>({
    queryKey: [ADMIN_PROFILE_QUERY_KEY],
    queryFn: () => AdminProfileService.getAdminProfile(),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profile: Partial<AdminProfile>) => 
      AdminProfileService.updateAdminProfile(profile),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        [ADMIN_PROFILE_QUERY_KEY],
        (oldData: AdminProfile | undefined) => 
          oldData ? { ...oldData, ...updatedProfile } : updatedProfile
      );
    },
  });
};

export const useAdminActivity = () => {
  return useQuery<Activity[]>({
    queryKey: [ADMIN_ACTIVITY_QUERY_KEY],
    queryFn: () => AdminProfileService.getRecentActivity(),
    staleTime: 2 * 60 * 1000, 
  });
};

export const useAdminStatistics = () => {
  return useQuery<Statistic[]>({
    queryKey: [ADMIN_STATISTICS_QUERY_KEY],
    queryFn: () => AdminProfileService.getStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
