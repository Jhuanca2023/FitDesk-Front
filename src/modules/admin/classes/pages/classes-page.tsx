import { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/components/animated/dialog';
import { toast } from 'sonner';
import DeleteConfirmationModal from '../components/delete-confirmation-modal';
import ClassErrorBoundary from '../components/error-boundary';

import { useClasses, useClassesForCalendar, useCreateClass, useUpdateClass, useDeleteClass } from '../hooks/use-classes';
import type { CalendarEvent } from '../lib/calendar-utils';
import { convertClassesToEvents } from '../lib/calendar-utils';
import { WeeklyCalendar } from '../components/weekly-calendar';
import { ClassDetailModal } from '../components/class-detail-modal';

import type { Class, ClassRequest } from '../types/class';

// Lazy load del formulario para evitar conflictos de DOM
const ClassForm = lazy(() => import('../components/class-form').then(module => ({ default: module.ClassForm })));

export default function ClassesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { data: classes = [], isLoading, refetch: refetchClasses } = useClasses();
  const { data: calendarClasses = [], refetch: refetchCalendarClasses, isFetching: isRefreshing } = useClassesForCalendar();
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();
  
  const events = useMemo<CalendarEvent[]>(() => {
    const classesToUse = calendarClasses.length > 0 ? calendarClasses : classes;
    console.log('Classes to use for calendar:', classesToUse);
    console.log('Calendar classes:', calendarClasses);
    console.log('Regular classes:', classes);
    
    const events = convertClassesToEvents(classesToUse);
    console.log('Generated events for calendar:', events);
    return events;
  }, [classes, calendarClasses]);

  const handleNewClass = useCallback(() => {
    setSelectedClass(null);
    setIsFormOpen(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchClasses(), refetchCalendarClasses()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [refetchClasses, refetchCalendarClasses]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    const originalClass = classes.find(c => c.id === event.id);
    if (originalClass) {
      setSelectedClass(originalClass);
      setIsDetailModalOpen(true);
    }
  }, [classes]);

  const handleEditFromDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleDeleteFromDetail = useCallback(async () => {
    if (!selectedClass?.id) return;
    
    try {
      await deleteClassMutation.mutateAsync(selectedClass.id);
      toast.success('Clase eliminada', {
        description: 'La clase ha sido eliminada correctamente y ya no aparecerá en el calendario'
      });
      setIsDetailModalOpen(false);
      setSelectedClass(null);
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Error al eliminar la clase', {
        description: 'No se pudo eliminar la clase. Inténtalo de nuevo.'
      });
    }
  }, [selectedClass, deleteClassMutation]);

  const handleSubmit = async (formData: ClassRequest) => {
    try {
      if (selectedClass?.id) {
        await updateClassMutation.mutateAsync({
          id: selectedClass.id,
          data: formData
        });
        toast.success('Clase actualizada', {
          description: 'La clase ha sido actualizada correctamente'
        });
      } else {
        await createClassMutation.mutateAsync(formData);
        toast.success('Clase creada', {
          description: 'La clase ha sido creada correctamente y aparecerá en el calendario'
        });
      }
      setIsFormOpen(false);
      setSelectedClass(null);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Error al guardar la clase', {
        description: 'No se pudo guardar la clase. Inténtalo de nuevo.'
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendario de Clases</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Horario Semanal</CardTitle>
            <Button onClick={handleNewClass}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Clase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <WeeklyCalendar
              events={events}
              onEventClick={handleEventClick}
              onNewEvent={handleNewClass}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              className="h-[600px]"
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles de la clase */}
      <ClassDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        onEdit={handleEditFromDetail}
        onDelete={() => setShowDeleteModal(true)}
        isDeleting={deleteClassMutation.isPending}
      />

      {/* Modal de formulario de clase */}
      <Dialog 
        open={isFormOpen} 
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setSelectedClass(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle className="text-xl font-semibold">
            {selectedClass ? 'Editar Clase' : 'Nueva Clase'}
          </DialogTitle>
          <DialogDescription>
            {selectedClass 
              ? 'Modifica los detalles de la clase existente.' 
              : 'Completa la información para crear una nueva clase.'
            }
          </DialogDescription>
          <div className="space-y-4">
            {isFormOpen && (
              <ClassErrorBoundary>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                }>
                  <ClassForm
                    key={`${selectedClass?.id || 'new'}-${Date.now()}`}
                    initialData={selectedClass}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setSelectedClass(null);
                    }}
                    isSubmitting={createClassMutation.isPending || updateClassMutation.isPending}
                  />
                </Suspense>
              </ClassErrorBoundary>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteFromDetail}
        isDeleting={deleteClassMutation.isPending}
        title="¿Eliminar clase?"
        description={selectedClass ? `¿Estás seguro de que deseas eliminar la clase "${selectedClass.className}"? Esta acción no se puede deshacer y la clase desaparecerá del calendario permanentemente.` : ''}
      />
    </div>
  );
}
