/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import { useQueryClient } from "@tanstack/react-query";
import type { MemberFilters } from "../interfaces/member.interface";
import { memberKeys } from "../queries/useMemberQuery";
import { MemberService } from "../services/member.service";
import { PlanService } from "../services/plan.service";

export const usePrefetchRoutes = () => {
    const queryClient = useQueryClient();


    const prefetchMembers = () => {
        const defaultFilters: MemberFilters = {
            // search: null,
            // membershipStatus: null,
            page: 0,
            size: 10,
            sortField: "firstName",
            sortDirection: "asc"
        }

        queryClient.prefetchQuery({
            queryKey: memberKeys.list(defaultFilters),
            queryFn: () => MemberService.getAllMembers(defaultFilters),
            staleTime: 5 * 60 * 1000,

        })
    }


    const prefetchTrainers = () => {
        // Implementa el prefetch de trainers cuando tengas el servicio
    };

    const prefetchPlans = () => {
        queryClient.prefetchQuery({
            queryKey: ["plans", "all"],
            queryFn: () => PlanService.getAllPlans(),
            staleTime: 5 * 60 * 1000,
        })
    };

    const prefetchClasses = () => {
        // Implementa el prefetch de clases
    };

    const prefetchLocations = () => {
        // Implementa el prefetch de ubicaciones
    };

    const prefetchBilling = () => {
        // Implementa el prefetch de facturación
    };

    const prefetchRoles = () => {
        // Implementa el prefetch de roles
    };
    return {
        prefetchMembers,
        prefetchTrainers,
        prefetchPlans,
        prefetchClasses,
        prefetchLocations,
        prefetchBilling,
        prefetchRoles,
    };
}