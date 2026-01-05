/** biome-ignore-all lint/complexity/noThisInStatic: <> */
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import { fitdeskApi } from "../api/fitdeskApi";
import type { AccountProviders, RolesWithDescription, UserStatisticsAccount } from "../interfaces/admin-user.interface";

export class AdminUserService {
    private static readonly BASE_URL = '/security/admin/users';


    static async getUserStatistics(): Promise<UserStatisticsAccount> {
        try {
            const { data } = await fitdeskApi.get<UserStatisticsAccount>(`${this.BASE_URL}`);
            return data;
        } catch (error) {
            console.error("Error fetching user statistics:", error);
            throw error;
        }
    }

    static async getRoleDetails(): Promise<RolesWithDescription[]> {
        try {
            const { data } = await fitdeskApi.get<RolesWithDescription[]>(`${this.BASE_URL}/roles`);
            return data;
        }
        catch (error) {
            console.error("Error fetching role details:", error);
            throw error;
        }
    }

    static async getUsersByProvider(): Promise<AccountProviders> {
        try {
            const { data } = await fitdeskApi.get<AccountProviders>(`${this.BASE_URL}/provider`);
            return data;
        }
        catch (error) {
            console.error("Error fetching users by provider:", error);
            throw error;
        }
    }

    static async removeRoleFromUser(id: string, role: string): Promise<void> {
        try {
            console.log(`Removing role ${role} from user ${id}`);
            await fitdeskApi.delete<void>(`${this.BASE_URL}/${id}/roles`, { data: { role } });
            console.log(`Successfully removed role ${role} from user ${id}`);
        }
        catch (error) {
            console.error(`Error removing role ${role} from user ${id}:`, error);
            throw error;
        }
    }

    static async assignRoleToUser(id: string, role: string): Promise<void> {
        try {
            await fitdeskApi.post<void>(`${this.BASE_URL}/${id}/roles`, { role });
        }
        catch (error) {
            console.error("Error assigning role to user:", error);
            throw error;
        }
    }

    static async desactiveUser(id: string, reason?: string): Promise<void> {
        try {
            const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
            await fitdeskApi.patch<void>(`${this.BASE_URL}/${id}/deactivate${params}`);
        }
        catch (error) {
            console.error("Error desactivating user:", error);
            throw error;
        }
    }

    static async activateUser(id: string): Promise<void> {
        try {
            await fitdeskApi.patch<void>(`${this.BASE_URL}/${id}/activate`);
        }
        catch (error) {
            console.error("Error activating user:", error);
            throw error;
        }
    }

    static async getUserRoles(id: string): Promise<{ userId: string; roles: string[] }> {
        try {
            const { data } = await fitdeskApi.get<{ userId: string; roles: string[] }>(`${this.BASE_URL}/${id}/roles`);
            return data;
        }
        catch (error) {
            console.error("Error fetching user roles:", error);
            throw error;
        }
    }

    static async changeUserRole(id: string, newRole: string, currentRoles: string[]): Promise<void> {
        try {
            console.log(`Changing role for user ${id} from ${currentRoles.join(', ')} to ${newRole}`);
            
            
            const userRolesData = await this.getUserRoles(id);
            const actualCurrentRoles = userRolesData.roles;
            
            console.log(`Actual roles for user ${id}:`, actualCurrentRoles);
            
  
            for (const currentRole of actualCurrentRoles) {
                try {
                    console.log(`Removing role ${currentRole} from user ${id}`);
                    await this.removeRoleFromUser(id, currentRole);
                } catch (error) {
                    console.warn(`Failed to remove role ${currentRole} from user ${id}, continuing...`, error);
                }
            }

            console.log(`Assigning new role ${newRole} to user ${id}`);
            await this.assignRoleToUser(id, newRole);
            console.log(`Successfully changed role for user ${id} to ${newRole}`);
        }
        catch (error) {
            console.error(`Error changing user role for user ${id}:`, error);
            throw error;
        }
    }
}