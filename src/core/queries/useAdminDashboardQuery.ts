import { useQuery } from "@tanstack/react-query";
import { AdminDashboardService } from "../services/admin-dashboard.service";
import { AdminRevenueService } from "../services/admin-revenue.service";

export const adminDashboardKeys = {
  all: ['adminDashboard'] as const,
  revenue: () => [...adminDashboardKeys.all, 'revenue'] as const,
  classes: () => [...adminDashboardKeys.all, 'classes'] as const,
};

export const useAdminRevenue = () => {
  return useQuery({
    queryKey: adminDashboardKeys.revenue(),
    queryFn: () => AdminDashboardService.getRevenueSummary(),
    staleTime: 60 * 1000,
  });
};

export const useAdminClassesSummary = () => {
  return useQuery({
    queryKey: adminDashboardKeys.classes(),
    queryFn: () => AdminDashboardService.getClassesSummary(),
    staleTime: 60 * 1000,
  });
};

export const useAdminMonthlyRevenueComparison = () => {
  return useQuery({
    queryKey: [...adminDashboardKeys.revenue(), 'monthly-compare'],
    queryFn: () => AdminDashboardService.getMonthlyRevenueComparison(),
    staleTime: 60 * 1000,
  });
};

export const useAdminRevenueSeries = () => {
  return useQuery({
    queryKey: [...adminDashboardKeys.revenue(), 'series', 6],
    queryFn: () => AdminRevenueService.getLast6MonthsSeries(),
    staleTime: 30 * 1000,
  });
};


