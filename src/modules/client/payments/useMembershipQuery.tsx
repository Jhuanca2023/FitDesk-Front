import { MemberService } from "@/core/services/member.service";
import { useQuery } from "@tanstack/react-query";




export const useMyMembership = () => {
    return useQuery({
        queryKey: ["membership", "my"],
        queryFn: () => MemberService.getMyMembership(),
        staleTime: 5 * 60 * 1000,
    });
};