import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { AlertCircle, Shield, User, Users } from 'lucide-react';
import { toast } from 'sonner'; // Using sonner like in client classes
import type { MemberWithRoles } from '@/core/interfaces/member.interface';
import type { UserRole } from '../types';

interface RoleEditDialogProps {
  user: MemberWithRoles;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
  children: React.ReactNode;
}

const roleConfig = {
  ADMIN: {
    label: 'Administrador',
    description: 'Acceso completo al sistema',
    icon: Shield,
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    permissions: ['Gestión de usuarios', 'Configuración del sistema', 'Reportes completos']
  },
  TRAINER: {
    label: 'Entrenador',
    description: 'Gestión de clases y clientes',
    icon: Users,
    color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    permissions: ['Crear clases', 'Gestionar clientes', 'Ver reportes básicos']
  },
  USER: {
    label: 'Usuario',
    description: 'Acceso básico al sistema',
    icon: User,
    color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    permissions: ['Reservar clases', 'Ver perfil', 'Historial personal']
  }
} as const;

export function RoleEditDialog({ user, onRoleChange, children }: RoleEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user.roles && user.roles.length > 0) {
      const roleNames = user.roles.map((role: { name: string }) => role.name);
      setCurrentRoles(roleNames);
      
      if (roleNames.includes('ADMIN')) {
        setSelectedRole('ADMIN');
      } else if (roleNames.includes('TRAINER')) {
        setSelectedRole('TRAINER');
      } else if (roleNames.includes('USER')) {
        setSelectedRole('USER');
      } else {
        setSelectedRole('USER');
      }
    }
  }, [user]);

  const handleRoleChange = async () => {
    if (selectedRole === currentRoles[0]) {
      toast.info('El usuario ya tiene este rol asignado');
      return;
    }

    setIsLoading(true);
    try {
      
      await onRoleChange(user.userId, selectedRole);

      setIsOpen(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error al actualizar el rol del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {

    const roleMapping: Record<string, UserRole> = {
      'USER': 'USER',
      'MEMBER': 'USER',
      'TRAINER': 'TRAINER',
      'ADMIN': 'ADMIN'
    };
    
    const validRole = roleMapping[role] || 'USER';
    const Icon = roleConfig[validRole].icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Editar Rol de Usuario
          </DialogTitle>
          <DialogDescription>
            Cambia el rol de este usuario para modificar sus permisos y acceso al sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del usuario */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-1">
                {currentRoles.map(role => (
                  <Badge key={role} variant="outline" className={roleConfig[role as UserRole]?.color}>
                    {getRoleIcon(role)}
                    <span className="ml-1">{roleConfig[role as UserRole]?.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Selector de rol */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Nuevo Rol</label>
            <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleConfig).map(([role, config]) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información del rol seleccionado */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              {getRoleIcon(selectedRole)}
              <h4 className="font-semibold">{roleConfig[selectedRole]?.label}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {roleConfig[selectedRole]?.description}
            </p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Permisos:</p>
              <ul className="text-xs space-y-1">
                {roleConfig[selectedRole]?.permissions.map((permission: string, index: number) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Advertencia */}
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Cambio de Acceso
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                Al cambiar el rol, el usuario perderá acceso a las funciones del rol anterior y obtendrá acceso a las nuevas funciones.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={isLoading || selectedRole === currentRoles[0]}
              className="min-w-[120px]"
            >
              {isLoading ? 'Actualizando...' : 'Confirmar Cambio'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
