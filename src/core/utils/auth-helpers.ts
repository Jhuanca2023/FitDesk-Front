import type { AuthAccess, UserLogin } from "../interfaces/auth.interface";
import { AuthService } from "../services/auth.service";
import type { AuthStore } from "../store/auth.store";

export const extractRoles = (authorities: AuthAccess['authorities']): string[] => {
    return authorities
        .filter(auth => auth.authority.startsWith("ROLE_"))
        .map(auth => auth.authority.replace("ROLE_", ""));
}

export const createUserFromMeData = (meData: AuthAccess): UserLogin => {
    const roles = extractRoles(meData.authorities);
    console.log("Roles del usuario:", roles);

    return {
        id: meData.id,
        email: meData.email,
        roles,
    };
}

export const authenticateUser = async (
    set: (partial: Partial<AuthStore>) => void
): Promise<boolean> => {
    try {
        const meData = await AuthService.me();
        const user = createUserFromMeData(meData);
        set({ user, authStatus: 'authenticated' });
        return true;
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        set({ user: null, authStatus: 'not-authenticated' });
        return false;
    }
}