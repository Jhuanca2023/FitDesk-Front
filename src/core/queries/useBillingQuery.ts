import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BillingDetailsParams } from "../interfaces/billing.interface";
import { BillingService } from "../services/billing.service";

export const billingKeys = {
  all: ["billing"] as const,
  lists: () => [...billingKeys.all, "details"] as const,
  list: (filters: BillingDetailsParams) =>
    [...billingKeys.lists(), filters] as const,
  statistics: () => [...billingKeys.all, "statistics"] as const,
};

export const useBillingDetails = (queryParram: BillingDetailsParams) => {
  return useQuery({
    queryKey: billingKeys.list(queryParram),
    queryFn: () => BillingService.getBillingDetails(queryParram),
    staleTime: 5 * 100 * 60,
    placeholderData: keepPreviousData,
  });
};

export const useBillingStatistics = () => {
  return useQuery({
    queryKey: billingKeys.statistics(),
    queryFn: () => BillingService.getDashboardStatistics(),
    staleTime: 5 * 100 * 60,
    placeholderData: keepPreviousData,
  });
};
