import { useQuery } from "@tanstack/react-query"
import { AdminUserService } from "../services/admin-user.service"

export const adminUserKeys = {
    all: ['adminUsers'] as const,
    statistics: () => [...adminUserKeys.all, 'statistics'] as const,
    roles: () => [...adminUserKeys.all, 'roles'] as const,
    providers: () => [...adminUserKeys.all, 'providers'] as const,
}


export const useGetUserStatistics = () => {
    return useQuery({
        queryKey: adminUserKeys.statistics(),
        queryFn: () => AdminUserService.getUserStatistics(),
        staleTime: 5 * 60 * 1000,
    })
}



export const useGetRoleDetails = () => {
    return useQuery({
        queryKey: adminUserKeys.roles(),
        queryFn: () => AdminUserService.getRoleDetails(),
        staleTime: 5 * 60 * 1000,
    })
}

export const useGetUsersByProvider = () => {
    return useQuery({
        queryKey: adminUserKeys.providers(),
        queryFn: () => AdminUserService.getUsersByProvider(),
        staleTime: 5 * 60 * 1000,
    })
}



