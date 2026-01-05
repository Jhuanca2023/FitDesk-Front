import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
import { AuthService } from '../services/auth.service';
import type { AuthRequestLogin, AuthRequestRegister, UserLogin } from '../interfaces/auth.interface';
import { authenticateUser } from '../utils/auth-helpers';


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'

export interface AuthStore {

    authStatus: AuthStatus
    user: UserLogin | null
    isUser: () => boolean,
    isAdmin: () => boolean
    isTrainer: () => boolean
    logout: () => Promise<void>
    login: (form: AuthRequestLogin) => Promise<void>;
    register: (register: AuthRequestRegister) => Promise<void>;
    checkAuthStatus: () => Promise<boolean>
}


const authAPI: StateCreator<AuthStore> = (set, get) => ({
    authStatus: 'checking',
    user: null,
    isUser: () => get().user?.roles.includes("USER") ?? false,
    isAdmin: () => get().user?.roles.includes("ADMIN") ?? false,
    isTrainer: () => get().user?.roles.includes("TRAINER") ?? false,
    login: async (form: AuthRequestLogin) => {
        set({ authStatus: 'checking' })
        try {
            const loginData = await AuthService.login(form)
            if (loginData.success) {
                await authenticateUser(set)
            } else {
                set({ user: null, authStatus: 'not-authenticated' })
            }
        } catch (error) {
            console.log("Error en login:", error)
            set({ user: null, authStatus: 'not-authenticated' })
            throw error;
        }
    },
    register: async (form: AuthRequestRegister) => {
        set({ authStatus: 'checking' });

        try {
            const registerData = await AuthService.register(form);

            if (registerData.success) {
                await authenticateUser(set);
            } else {
                set({ authStatus: 'not-authenticated' });
            }
        } catch (error) {
            console.error("Error en register:", error);
            set({ authStatus: 'not-authenticated' });
            throw error;
        }
    },

    logout: async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            set({ authStatus: 'not-authenticated', user: null });
        }
    },

    checkAuthStatus: async () => {
        set({ authStatus: 'checking' });

        try {
            const data = await AuthService.refresh();

            if (data.success) {
                return await authenticateUser(set);
            } else {
                set({ authStatus: 'not-authenticated', user: null });
                return false;
            }
        } catch (error) {
            console.error("Error en checkAuthStatus:", error);

            if (get().authStatus !== 'authenticated') {
                set({ authStatus: 'not-authenticated', user: null });
            }
            return false;
        }
    }
})

export const useAuthStore = create<AuthStore>()(
    persist(
        devtools(authAPI),
        {
            name: "fitdesk-user",
            partialize: (state) => ({ user: state.user })
        }
    )
)

