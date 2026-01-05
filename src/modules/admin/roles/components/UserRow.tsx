import { Shield, Users, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserRole } from '../types';

import { StatusToggle } from './StatusToggle';
import { RoleEditDialog } from './RoleEditDialog';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { MemberWithRoles } from '@/core/interfaces/member.interface';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
;

interface UserRowProps {
  user: MemberWithRoles;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export function UserRow({ user, onRoleChange }: UserRowProps) {
  const formatDate = (dateString?: string, showTime = false) => {
    if (!dateString) return 'Nunca';

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    if (showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString('es-PE', options);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return <Shield className="h-3 w-3" />;
      case 'TRAINER':
        return <Users className="h-3 w-3" />;
      case 'USER':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'TRAINER':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'USER':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;


      if (isMenuOpen && !target.closest('[data-menu="actions"]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);



  return (

    <TableRow>


      <TableCell className="min-w-[180px] px-10">
        <Avatar>
          <AvatarImage src={user.profileImageUrl || user.initials} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="min-w-[180px]">
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium">{user.lastName}</div>
            <div className="text-xs text-muted-foreground">
              {/* {formatJoinDate(user.joinDate)} */}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="min-w-[200px]">
        <div className="text-sm">{user.email}</div>
      </TableCell>

      <TableCell className="min-w-[150px] text-sm">
        {formatDate(user.lastLogin, true)}
      </TableCell>

      <TableCell className="min-w-[150px]">
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role: { name: string }) => (
              <Badge 
                key={role.name} 
                variant="outline" 
                className={`${getRoleColor(role.name)} text-xs`}
              >
                {getRoleIcon(role.name)}
                <span className="ml-1">{role.name}</span>
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 text-xs">
              <User className="h-3 w-3" />
              <span className="ml-1">Sin rol</span>
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="min-w-[100px]">
        <div className="flex justify-center">
          <StatusToggle userId={user.userId} />
        </div>
      </TableCell>

      <TableCell className="min-w-[120px]">
        <div className="flex justify-center">
          <RoleEditDialog user={user} onRoleChange={onRoleChange}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3"
            >
              <Shield className="h-3 w-3 mr-1" />
              Editar Rol
            </Button>
          </RoleEditDialog>
        </div>
      </TableCell>
    </TableRow>



  );
}