import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlanService } from "../../../../core/services/plan.service";
import type {
  CreatePlanRequest,
  UpdatePlanRequest,
} from "@/core/interfaces/plan.interface";

export const useActivePlans = () => {
  return useQuery({
    queryKey: ["plans", "active"],
    queryFn: PlanService.getActivePlans,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAllPlans = () => {
  return useQuery({
    queryKey: ["plans", "all"],
    queryFn: PlanService.getAllPlans,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlanById = (id: string) => {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: () => PlanService.getPlanById(id),
    enabled: !!id,
  });
};

export const usePopularPlans = () => {
  return useQuery({
    queryKey: ["plans", "popular"],
    queryFn: PlanService.getPopularPlans,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlansByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: ["plans", "price-range", minPrice, maxPrice],
    queryFn: () => PlanService.getPlansByPriceRange(minPrice, maxPrice),
    enabled: minPrice >= 0 && maxPrice > minPrice,
  });
};

export const usePlansByDuration = (months: number) => {
  return useQuery({
    queryKey: ["plans", "duration", months],
    queryFn: () => PlanService.getPlansByDuration(months),
    enabled: months > 0,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planData, image }: { planData: CreatePlanRequest; image?: File }) =>
      PlanService.createPlan(planData, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, image }: { id: string; data: UpdatePlanRequest; image?: File }) =>
      PlanService.updatePlan(id, data, image),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plans", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["plans", "active"] });
      queryClient.invalidateQueries({ queryKey: ["plans", "all"] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlanService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useUploadPlanImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, file }: { planId: string; file: File }) =>
      PlanService.uploadPlanImage(planId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plans", variables.planId] });
      queryClient.invalidateQueries({ queryKey: ["plans", "all"] });
      queryClient.invalidateQueries({ queryKey: ["plans", "active"] });
    },
  });
};

export const useDeletePlanImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => PlanService.deletePlanImage(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ["plans", planId] });
      queryClient.invalidateQueries({ queryKey: ["plans", "all"] });
      queryClient.invalidateQueries({ queryKey: ["plans", "active"] });
    },
  });
};