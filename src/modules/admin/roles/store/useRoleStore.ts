import { create } from 'zustand';
import { AdminUserService } from '@/core/services/admin-user.service';
import type { 
  UserWithRole, 
  UserRole
} from '../types';

interface RoleState {
  users: UserWithRole[];
  isLoading: boolean;
  error: string | null;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };


  fetchUsers: () => Promise<void>;
  updateUserRole: (data: { userId: string; role?: UserRole; status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' }) => Promise<{ user: UserWithRole; previousRole?: UserRole; notificationSent: boolean }>;
  changeUserRole: (userId: string, newRole: UserRole, currentRoles: string[]) => Promise<void>;
  setPagination: (page: number) => void;
  resetUserFilters: () => void;
}

const useRoleStore = create<RoleState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  userFilters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
    
    
      set({ 
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar usuarios';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateUserRole: async ({ userId, role, status }) => {
    const previousUser = get().users.find(u => u.userId === userId);
    if (!previousUser) throw new Error('Usuario no encontrado');

    
    set(state => ({
      users: state.users.map(u => 
        u.userId === userId ? { ...u, role: role || u.role, status: status || u.status } : u
      )
    }));

    return {
      user: { ...previousUser, role: role || previousUser.role, status: status || previousUser.status },
      previousRole: previousUser.role,
      notificationSent: false
    };
  },

  changeUserRole: async (userId, newRole, currentRoles) => {
    set({ isLoading: true, error: null });
    try {
      await AdminUserService.changeUserRole(userId, newRole, currentRoles);
      
      
      set(state => ({
        users: state.users.map(u => 
          u.userId === userId ? { ...u, role: newRole } : u
        ),
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el rol del usuario';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setPagination: (page) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));
  },

  resetUserFilters: () => {
    set({ 

      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    });
  }
}));

export default useRoleStore;
