import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { TrainerForm } from '../components/TrainerForm';
import { BasicTrainerForm } from '../components/BasicTrainerForm';
import { trainerService } from '../services/trainer.service';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface TrainerFormPageProps {
  isEditMode?: boolean;
}

export function TrainerFormPage({ isEditMode = false }: TrainerFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();


  const { data: trainer, isLoading } = useQuery({
    queryKey: ['trainer', id],
    queryFn: () => id ? trainerService.getById(id) : Promise.resolve(undefined),
    enabled: isEditMode && !!id,
    initialData: undefined,
  });

  const handleSuccess = () => {
    navigate('/admin/trainers');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Button>
            <span>{isEditMode ? 'Editar Entrenador' : 'Nuevo Entrenador'}</span>
          </div>
        }
      />

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isEditMode ? (
          <TrainerForm 
            trainer={trainer} 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <BasicTrainerForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
