import { useQuery } from "@tanstack/react-query";
import { AdminActivityService } from "../services/admin-activity.service";

export const adminActivityKeys = {
  all: ['adminActivity'] as const,
  recent: (limit: number) => [...adminActivityKeys.all, 'recent', limit] as const,
};

export const useAdminRecentActivity = (limit = 3) => {
  return useQuery({
    queryKey: adminActivityKeys.recent(limit),
    queryFn: () => AdminActivityService.getRecentActivity(limit),
    staleTime: 30 * 1000,
  });
};


