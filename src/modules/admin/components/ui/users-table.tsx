'use client';

import { memo, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
    TrendingUp,
    Plus,
    Calendar,
    Mail,
    MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Image } from '@/shared/components/ui/image';
import { useAllMembersQuery } from '@/core/queries/useMemberQuery';
import { AdminUserService } from '@/core/services/admin-user.service';

interface UserWithRole {
    userId: string;
    firstName: string;
    lastName?: string | null;
    email?: string;
    profileImageUrl?: string | null;
    role: string;
    createdAt?: string;
}

interface UsersTableProps {
    onAddUser: () => void;
}

export const UsersTable = memo(({ onAddUser }: UsersTableProps) => {
    const { data: membersResponse } = useAllMembersQuery({ page: 0, size: 3, sortField: 'createdAt', sortDirection: 'desc' });
    const members = Array.isArray((membersResponse as any)?.members) ? (membersResponse as any).members : [];
    const [users, setUsers] = useState<UserWithRole[]>([]);

    useEffect(() => {
        const loadUserRoles = async () => {
            const usersWithRoles = await Promise.all(members.slice(0, 3).map(async (m: any) => {
                try {
                    const rolesData = await AdminUserService.getUserRoles(m.userId);
                    const primaryRole = rolesData.roles?.[0] || 'USER';
                    return {
                        userId: m.userId,
                        firstName: m.firstName || '',
                        lastName: m.lastName || null,
                        email: m.email || '',
                        profileImageUrl: m.profileImageUrl || null,
                        role: primaryRole,
                        createdAt: (m as any).createdAt,
                    };
                } catch {
                    return {
                        userId: m.userId,
                        firstName: m.firstName || '',
                        lastName: m.lastName || null,
                        email: m.email || '',
                        profileImageUrl: m.profileImageUrl || null,
                        role: 'USER',
                        createdAt: (m as any).createdAt,
                    };
                }
            }));
            setUsers(usersWithRoles);
        };
        if (members.length) loadUserRoles();
    }, [members]);

    const roleColors: Record<string, string> = {
        ADMIN: 'bg-purple-500/10 text-purple-500',
        TRAINER: 'bg-blue-500/10 text-blue-500',
        USER: 'bg-gray-500/10 text-gray-500',
    };
    const roleLabels: Record<string, string> = {
        ADMIN: 'Admin',
        TRAINER: 'Entrenador',
        USER: 'Usuario',
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'numeric', year: 'numeric' });
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="border-border bg-card/40 rounded-xl border p-3 sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-semibold sm:text-xl">Usuarios Recientes</h3>
                    <p className="text-muted-foreground text-sm">
                        Últimos registros y actividad
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>+{users.length}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={onAddUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Agregar Usuario</span>
                        <span className="sm:hidden">Agregar</span>
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No hay usuarios recientes
                    </div>
                ) : (
                    users.map((user, index) => {
                        const fullName = `${user.firstName} ${user.lastName || ''}`.trim() || user.email || 'Usuario';
                        const avatarUrl = user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
                        return (
                            <motion.div
                                key={user.userId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-accent/50 flex flex-col items-start gap-4 rounded-lg p-4 transition-colors sm:flex-row sm:items-center"
                            >
                                <div className="flex w-full items-center gap-4 sm:w-auto">
                                    <div className="relative">
                                        <Image
                                            src={avatarUrl}
                                            alt={fullName}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div className="border-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 bg-green-500" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="truncate text-sm font-medium">{fullName}</h4>
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[user.role] || roleColors.USER}`}>
                                                {roleLabels[user.role] || 'Usuario'}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground mt-1 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4">
                                            {user.email && (
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-auto flex items-center gap-3">
                                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(user.createdAt)}</span>
                                    </div>

                                    <Button variant="ghost" size="sm" className="ml-auto">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
});

UsersTable.displayName = 'UsersTable';
