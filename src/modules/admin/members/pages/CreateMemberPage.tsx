import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/toast';
import { MemberForm } from '../components/MemberForm';

export function CreateMemberPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  
  const handleSuccess = (newMember?: { id: string }) => {
    toast({
      title: 'Miembro creado',
      description: 'El nuevo miembro ha sido registrado correctamente.',
    });
    if (newMember?.id) {
      navigate(`/admin/members/${newMember.id}`);
    } else {
      navigate('/admin/members');
    }
  };

  return (
    <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Nuevo Miembro
          </h1>
          <p className="text-muted-foreground">
            Registra un nuevo miembro en el sistema
          </p>
        </div>
      </div>

      <MemberForm
        onSuccess={() => handleSuccess({ id: 'new-id' })}
        onCancel={() => navigate('/admin/members')}
      />
    </div>
  );
}
