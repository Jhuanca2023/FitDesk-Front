import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { AuthService } from "../services/auth.service";
import type { AuthRequestLogin, AuthRequestRegister } from "../interfaces/auth.interface";
import { toast } from "@/shared/components/ui/toast-provider";


export const authKeys = {
    all: ["auth"] as const,
    me: () => [...authKeys.all, "me"] as const,
    status: () => [...authKeys.all, "status"] as const,
}
export const useAuthQueries = () => {
    const queryClient = useQueryClient();
    // const user = useAuthStore((state) => state.user);
    const authStatus = useAuthStore((state) => state.authStatus);
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const logout = useAuthStore((state) => state.logout);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

    const useCurrentUserQuery = useQuery({
        queryKey: authKeys.me(),
        queryFn: AuthService.me,
        enabled: authStatus === 'authenticated',
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false
    });

    const useLoginMutation = useMutation({
        mutationFn: async (credentials: AuthRequestLogin) => {
            await login(credentials);
            return AuthService.me();
        },
        onSuccess: (data) => {
            console.log("Usuario logueado", data);
            queryClient.setQueryData(authKeys.me(), data);
        },
        onError: (error) => {
            toast.error("Error al iniciar sesión: " + (error instanceof Error ? error.message : String(error)));
            queryClient.removeQueries({ queryKey: authKeys.all });
        }
    });


    const useRegisterMutation = useMutation({
        mutationFn: async (registrationData: AuthRequestRegister) => {
            await register(registrationData);
            return AuthService.me();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me(), data);
        },
        onError: (error) => {
            toast.error("Error al registrar: " + (error instanceof Error ? error.message : String(error)));
            queryClient.removeQueries({ queryKey: authKeys.all });
        }
    })

    const useLogoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
        }
    });

    const useAuthQuery = useQuery({
        queryKey: authKeys.status(),
        queryFn: checkAuthStatus,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
        enabled: false
    })
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:9091/oauth2/authorization/google";
    };

    return {
        useCurrentUserQuery,
        useLoginMutation,
        useRegisterMutation,
        useLogoutMutation,
        useAuthQuery,
        handleGoogleLogin
    };
};