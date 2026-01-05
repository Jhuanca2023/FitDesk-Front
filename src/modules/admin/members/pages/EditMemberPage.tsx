import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/toast';
import { MemberForm } from '../components/MemberForm';
import { useMember } from '../hooks/useMembers';


const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary ${className || ''}`} />
);

export function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { member, isLoading, error, refetch } = useMember(id);

  const handleSuccess = () => {
    toast({
      title: 'Miembro actualizado',
      description: 'La información del miembro ha sido actualizada correctamente.',
    });
    navigate(`/admin/members/${id}`);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <LoadingSpinner className="h-8 w-8" />
          <p className="text-muted-foreground">Cargando información del miembro...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-destructive">Error:</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                {error ? error.message : 'No se pudo cargar la información del miembro'}
              </h3>
              <div className="mt-2 text-sm text-destructive">
                <p>{error instanceof Error ? error.message : String(error) || 'El miembro solicitado no existe o no tienes permisos para editarlo.'}</p>
              </div>
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  Reintentar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/members')}
                >
                  Volver a la lista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6 max-w-7xl">
      <div className="flex flex-col space-y-4 p-4 sm:p-6 bg-card rounded-lg shadow-sm">
        <Button
          variant="ghost"
          className="w-fit p-0 hover:bg-transparent"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la lista
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Miembro</h1>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-card rounded-lg shadow-sm">
        <MemberForm
          member={member}
          onSuccess={handleSuccess}
          onCancel={() => navigate(`/admin/members/${id}`)}
        />
      </div>
    </div>
  );
}
