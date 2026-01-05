import { useAuthStore } from "../store/auth.store"

export const useUserRole = () => {
    const { isUser, isAdmin, isTrainer, user } = useAuthStore();

    return {
        isUser: isUser(),
        isAdmin: isAdmin(),
        isTrainer: isTrainer(),
        user,
        hasRole: (role: string) => user?.roles.includes(role) ?? false,
        hasAnyRole: (...roles: string[]) =>
            roles.some(role => user?.roles.includes(role)) ?? false,
    };
};