
import { useEffect, useState } from 'react';
import useRoleStore from '../store/useRoleStore';
import { toast } from 'sonner';
import type { UserRole } from '../types';
import { UserTable } from '../components/UserTable';
import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'motion/react';
import { Users, Shield, UserCheck } from 'lucide-react';
import { useGetUserStatistics } from '@/core/queries/useAdminUserQuery';
import { useAllMembersQuery } from '@/core/queries/useMemberQuery';
import { AdminUserService } from '@/core/services/admin-user.service';
import type { MemberWithRoles } from '@/core/interfaces/member.interface';


export default function UserRolesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [usersWithRoles, setUsersWithRoles] = useState<MemberWithRoles[]>([]);

  const { data: userStats } = useGetUserStatistics();
  const { data: members } = useAllMembersQuery({});

  const {
    fetchUsers
  } = useRoleStore();


  const fetchUserRoles = async (members: any[]) => {
    const usersWithRolesPromises = members.map(async (member) => {
      try {
        const rolesData = await AdminUserService.getUserRoles(member.userId);
        return {
          ...member,
          roles: rolesData.roles.map(roleName => ({ name: roleName })),
          lastLogin: null
        } as MemberWithRoles;
      } catch (error) {
        console.warn(`No se pudieron obtener roles para usuario ${member.userId}:`, error);
        return {
          ...member,
          roles: [],
          lastLogin: null
        } as MemberWithRoles;
      }
    });

    const usersWithRoles = await Promise.all(usersWithRolesPromises);
    setUsersWithRoles(usersWithRoles);
  };

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        await fetchUsers();
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Error al cargar los usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [fetchUsers]);


  useEffect(() => {
    if (members?.members && members.members.length > 0) {
      fetchUserRoles(members.members);
    }
  }, [members]);



  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const user = usersWithRoles.find(u => u.userId === userId);
      const userName = user ? `${user.firstName} ${user.lastName}` : 'Usuario';
      
      await AdminUserService.changeUserRole(userId, newRole, []);
      
      
      const roleLabels = {
        ADMIN: 'Administrador',
        TRAINER: 'Entrenador', 
        USER: 'Usuario'
      };
      
      toast.success(`${userName} ahora tiene el rol de ${roleLabels[newRole]}`);

      await fetchUserRoles(members?.members || []);
    } catch (error) {
      toast.error('Error al actualizar el rol');

      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Administra los roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Usuarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3 bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-1 text-3xl font-bold">
                {userStats?.totalUsers}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                Total Usuarios
              </p>
            </div>
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3 bg-purple-500/10">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Roles
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Administradores:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {userStats?.roleCounts.ADMIN || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Entrenadores:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {userStats?.roleCounts.TRAINER || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Usuarios:</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {userStats?.roleCounts.USER || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3 bg-green-500/10">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Estados
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Activos:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {userStats?.activeUsers || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inactivos:</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {userStats?.inactiveUsers || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Suspendidos:</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {userStats?.suspendedUsers || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>


      <UserTable
        users={usersWithRoles}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
      />

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Mostrando {usersWithRoles.length} usuarios</p>
      </div>
    </div>
  );
}