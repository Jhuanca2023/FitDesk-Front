import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ClientClass } from '../types';
import { useConfirmAttendance, useCancelClass } from '../hooks/use-client-classes';

interface ClassCardProps {
  classItem: ClientClass;
  index: number;
}

export function ClassCard({ classItem, index }: ClassCardProps) {
  const confirmAttendanceMutation = useConfirmAttendance();
  const cancelClassMutation = useCancelClass();

 
  const formattedDate = format(parseISO(classItem.date), 'EEEE', { locale: es });
  const endTime = new Date(new Date(`2000-01-01T${classItem.time}`).getTime() + classItem.duration * 60000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const formattedTime = `${classItem.time} - ${endTime}`;


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  const handleConfirmAttendance = () => {
    if (classItem.reservationId) {
      confirmAttendanceMutation.mutate(classItem.reservationId);
    }
  };

  const handleCancelClass = () => {
    cancelClassMutation.mutate(classItem.id);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          badgeVariant: 'default' as const,
          badgeText: 'Próxima',
          badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
        };
      case 'pending':
        return {
          badgeVariant: 'secondary' as const,
          badgeText: 'Pendiente',
          badgeClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
        };
      case 'completed':
        return {
          badgeVariant: 'outline' as const,
          badgeText: 'Completada',
          badgeClass: 'bg-green-500/10 text-green-500 border-green-500/20'
        };
      default:
        return {
          badgeVariant: 'outline' as const,
          badgeText: 'Desconocido',
          badgeClass: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        };
    }
  };

  const statusConfig = getStatusConfig(classItem.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
    >
      {/* Gradiente sutil en hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative space-y-4">
        {/* Header con nombre de clase y estado */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {classItem.title}
          </h3>
          <Badge className={statusConfig.badgeClass}>
            {statusConfig.badgeText}
          </Badge>
        </div>

        {/* Información del entrenador */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={classItem.trainer.avatar} alt={classItem.trainer.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(classItem.trainer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Con {classItem.trainer.name}</span>
          </div>
        </div>

        {/* Información de ubicación, fecha y hora */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{classItem.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>

          {/* Información de capacidad - solo para clases próximas */}
          {classItem.status === 'upcoming' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{classItem.currentParticipants}/{classItem.maxParticipants} inscritos</span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        {classItem.status === 'upcoming' && (
          <div className="flex gap-2 pt-2">
            {classItem.canConfirm && (
              <Button
                size="sm"
                onClick={handleConfirmAttendance}
                disabled={confirmAttendanceMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {confirmAttendanceMutation.isPending ? 'Confirmando...' : 'Confirmar Asistencia'}
              </Button>
            )}
            
            {classItem.canCancel && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleCancelClass}
                disabled={cancelClassMutation.isPending}
              >
                {cancelClassMutation.isPending ? 'Cancelando...' : 'Cancelar Reserva'}
              </Button>
            )}
          </div>
        )}

        {/* Información para clases pendientes */}
        {classItem.status === 'pending' && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Esperando confirmación del entrenador
            </p>
          </div>
        )}

        {/* Información para clases completadas */}
        {classItem.status === 'completed' && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              ✅ Completada
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}
