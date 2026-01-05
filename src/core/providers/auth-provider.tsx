import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { PageLoader } from "@/shared/components/page-loader";
import type { PropsWithChildren } from "react";

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
	const { checkAuthStatus, authStatus } = useAuthStore();
	const { isLoading } = useQuery({
		queryKey: ["auth"],
		queryFn: async () => {
			if (authStatus === "authenticated") {
				return true;
			}
			return checkAuthStatus();
		},
		retry: false,
		refetchOnWindowFocus: true,
	});
	if (isLoading) return <PageLoader />;

	return children;
};
