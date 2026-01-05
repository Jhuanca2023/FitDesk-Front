import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus, Shield } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { toast } from 'sonner';

import { PlanModal } from '../components/plan-modal';
import { PlanCard } from '../components/plan-card';
import { useDeletePlan, useAllPlans, useUpdatePlan, useCreatePlan } from '../hooks/usePlansQuery';
import { usePlanImageStore } from '../store/usePlanImageStore';
import type { PlanResponse } from '@/core/interfaces/plan.interface';
import type { FormValues } from '../components/plan-form';

const PlansPage = () => {
  const { data: plans, isLoading, error } = useAllPlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const { reset: resetImageStore } = usePlanImageStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanResponse | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset image store when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      resetImageStore();
    }
  }, [isModalOpen, resetImageStore]);

  const handleEdit = (plan: PlanResponse) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPlan(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: FormValues & { image?: File }) => {
    setIsSubmitting(true);
    try {
      const { image, ...planData } = values;
      
      if (selectedPlan?.id) {
        await updatePlan.mutateAsync({ 
          id: selectedPlan.id, 
          data: planData, 
          image 
        });
        toast.success('El plan se ha actualizado correctamente');
      } else {
        await createPlan.mutateAsync({ 
          planData, 
          image 
        });
        toast.success('El plan se ha creado correctamente');
      }
      
      setIsModalOpen(false);
      setSelectedPlan(undefined);
      resetImageStore();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Ha ocurrido un error al guardar el plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePlan.mutateAsync(id);
      toast.success('El plan se ha eliminado correctamente');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Ha ocurrido un error al eliminar el plan');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">No se pudieron cargar los planes. Por favor, inténtalo de nuevo más tarde.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planes</h1>
          <p className="text-muted-foreground">
            Gestiona los planes de suscripción disponibles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      {plans?.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Shield className="h-14 w-14 text-muted-foreground" />
            <h3 className="text-xl font-medium">No hay planes</h3>
            <p className="text-muted-foreground max-w-md">
              Aún no has creado ningún plan. Crea tu primer plan para
              empezar a ofrecer servicios especiales a tus clientes.
            </p>
            <div className="mt-6">
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Plan
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans?.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </Card>
      )}

      {isModalOpen && (
        <PlanModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          plan={selectedPlan}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default PlansPage;