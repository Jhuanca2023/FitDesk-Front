import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MemberService } from "../services/member.service";
import type { MemberFilters } from "../interfaces/member.interface";

export const memberKeys = {
    all: ['members'] as const,
    lists: () => [...memberKeys.all, 'list'] as const,
    list: (filters: MemberFilters) => [...memberKeys.lists(), filters] as const,
    details: () => [...memberKeys.all, 'detail'] as const,
    detail: (id: string) => [...memberKeys.details(), id] as const,
};

export const useAllMembersQuery = (filters: MemberFilters) => {
    return useQuery({
        queryKey: memberKeys.list(filters),
        queryFn: () => MemberService.getAllMembers(filters),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}


export const useMemberByIdWithSecurityQuery = (id: string) => {
    return useQuery({
        queryKey: memberKeys.detail(id),
        queryFn: () => MemberService.getMemberByIdWithSecurity(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

