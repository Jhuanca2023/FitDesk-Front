import React, { useState } from 'react';
import { Clock, Users, MapPin, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/animated/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Class } from '../types/class';
import DeleteConfirmationModal from './delete-confirmation-modal';

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class | null;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classData,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!classData) return null;

  // Parsear la fecha correctamente desde formato DD-MM-YYYY
  let classDate: Date;
  if (typeof classData.classDate === 'string' && classData.classDate.includes('-')) {
    const [day, month, year] = classData.classDate.split('-');
    classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    classDate = new Date(classData.classDate);
  }
  
  // Validar que la fecha sea válida
  if (isNaN(classDate.getTime())) {
    console.error('Invalid date:', classData.classDate);
    classDate = new Date(); // Fallback a fecha actual
  }
  
  const [startTime, endTime] = classData.schedule.split(' - ');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalles de la Clase
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información principal */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{classData.className}</CardTitle>
                  <Badge 
                    variant={classData.active ? "default" : "secondary"} 
                    className={`mt-2 ${!classData.active ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}`}
                  >
                    {classData.active ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fecha y horario */}
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {format(classDate, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es })}
                  </div>
                  <div className="text-muted-foreground">
                    {startTime} - {endTime} ({classData.duration} minutos)
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{classData.locationName}</div>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{classData.trainerName}</div>
                </div>
              </div>

              {/* Capacidad */}
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Capacidad: {classData.maxCapacity} personas</div>
                </div>
              </div>

              {/* Descripción */}
              {classData.description && (
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Descripción:</div>
                  <div className="text-sm">{classData.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cerrar
            </Button>
            <Button 
              variant="outline" 
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="flex items-center gap-2 hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
      
      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
        isDeleting={isDeleting}
        title="¿Eliminar clase?"
        description={`¿Estás seguro de que deseas eliminar la clase "${classData.className}"? Esta acción no se puede deshacer y la clase desaparecerá del calendario permanentemente.`}
      />
    </Dialog>
  );
};

export default ClassDetailModal;
