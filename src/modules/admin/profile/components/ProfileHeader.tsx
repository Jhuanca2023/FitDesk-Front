import { Edit } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProfileHeaderProps {
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ProfileHeader = ({
  isEditing,
  isUpdating,
  onEdit,
  onCancel,
  onSave,
}: ProfileHeaderProps) => {
  return (
    <div className="px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Perfil de Administrador
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gestiona tu información personal y configuración
          </p>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar perfil
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={isUpdating}>
              {isUpdating ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
