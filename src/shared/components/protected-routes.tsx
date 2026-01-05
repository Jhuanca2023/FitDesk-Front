import { useAuthStore } from "@/core/store/auth.store"
import type { PropsWithChildren } from "react"
import { Navigate } from "react-router";


const getRedirectPathByRole = (user: { roles: string[] } | null): string => {
    if (!user) return "/";
    
    if (user.roles.includes("ADMIN")) {
        return "/admin";
    }
    if (user.roles.includes("TRAINER")) {
        return "/trainer/dashboard";
    }
    if (user.roles.includes("USER")) {
        return "/client/dashboard";
    }
    return "/";
};

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'checking') return null;

    if (authStatus === 'not-authenticated') return <Navigate to={"/"} />

    return children;

}

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus, user } = useAuthStore();
    
    if (authStatus === 'checking') return null;

    if (authStatus === 'authenticated') {
        const redirectPath = getRedirectPathByRole(user);
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
    const { authStatus, isAdmin, user } = useAuthStore();
    
    if (authStatus === 'checking') return null;

    if (authStatus === 'not-authenticated') return <Navigate to="/auth" replace />;

    if (!isAdmin()) {
        const redirectPath = getRedirectPathByRole(user);
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export const TrainerRoute = ({ children }: PropsWithChildren) => {
    const { authStatus, isTrainer, user } = useAuthStore();

    if (authStatus === 'checking') return null;

    if (authStatus === 'not-authenticated') return <Navigate to="/auth" replace />;

    if (!isTrainer()) {
        const redirectPath = getRedirectPathByRole(user);
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};