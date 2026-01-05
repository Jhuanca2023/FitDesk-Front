import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard.service";


export const useDashboardMember = () => {
  return useQuery({
    queryKey: ["dashboard", "member"],
    queryFn: DashboardService.getDashboardMember,
    staleTime: 2 * 60 * 1000,
  });
};


export const useClassesCalendar = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["dashboard", "calendar", startDate, endDate],
    queryFn: () => DashboardService.getClassesCalendar(startDate, endDate),
    staleTime: 2 * 60 * 1000,
  });
};
export const useUpcomingClasses = () => {
  return useQuery({
    queryKey: ["dashboard", "upcoming"],
    queryFn: DashboardService.getUpcomingClasses,
    staleTime: 2 * 60 * 1000,
  });
};
