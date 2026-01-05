import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { UserRow } from './UserRow';
import type { UserWithRole } from '../types';
import type { MemberWithRoles } from '@/core/interfaces/member.interface';

interface UserTableProps {
  users: MemberWithRoles[];
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: UserWithRole['role']) => Promise<void>;
}

export function UserTable({
  users,
  isLoading,
  onRoleChange
}: UserTableProps) {

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead className="min-w-[180px] px-10">
                Avatar
              </TableHead>
              <TableHead className="min-w-[180px]">
                Usuario
              </TableHead>
              <TableHead className="min-w-[200px]">
                Correo
              </TableHead>
              <TableHead className="min-w-[150px]">
                Último acceso
              </TableHead>
              <TableHead className="min-w-[150px] text-center">Roles</TableHead>
              <TableHead className="min-w-[100px] text-center">Estado</TableHead>
              <TableHead className="min-w-[120px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow
                key={user.userId}
                user={user}
                onRoleChange={onRoleChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}