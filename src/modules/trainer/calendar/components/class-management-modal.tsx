import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Clock, 
  MapPin, 
  Users, 
  Play, 
  Square,
  RefreshCw
} from 'lucide-react';
import { ClassTimer } from './class-timer';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/animated/dialog';
import { cn } from '@/core/lib/utils';
import type { CalendarEvent } from '../types';
import { CLASS_STATUS_COLORS, CLASS_STATUS_LABELS } from '../types';
import { 
  useStartClass, 
  useEndClass, 
  useCancelClass,
  useTrainerClass 
} from '../hooks/use-trainer-classes';

interface ClassManagementModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshClasses?: () => void;
}

export function ClassManagementModal({
  event,
  isOpen,
  onClose,
  onRefreshClasses
}: ClassManagementModalProps) {
  const [actualClassStartTime, setActualClassStartTime] = useState<Date | null>(null);
  const [isRefreshingStudents, setIsRefreshingStudents] = useState(false);
  const [hasTakenAttendance, setHasTakenAttendance] = useState(false);
  const [finalClassTime, setFinalClassTime] = useState<{ elapsed: number; isOvertime: boolean; overtime: number } | null>(null);
  const navigate = useNavigate();


  const { data: classDetail, refetch: refetchClassDetail, isLoading: isLoadingClassDetail } = useTrainerClass(event?.id || '');
  
  const startClassMutation = useStartClass();
  const endClassMutation = useEndClass();
  const cancelClassMutation = useCancelClass();
  
  
  const currentStatus = classDetail?.status || event?.status;
  
  useEffect(() => {
    if (classDetail?.enrolledMembers) {
      const hasAttendanceData = classDetail.enrolledMembers.some(
        member => member.attendanceStatus
      );
      setHasTakenAttendance(hasAttendanceData);
    }
  }, [classDetail?.enrolledMembers]);
  
  useEffect(() => {
    if (currentStatus === 'completed' && event?.id) {
      const storageKey = `class_timer_final_${event.id}`;
      const savedFinalTime = localStorage.getItem(storageKey);
      if (savedFinalTime) {
        try {
          const finalTime = JSON.parse(savedFinalTime);
          setFinalClassTime(finalTime);
        } catch {}
      }
    }
  }, [currentStatus, event?.id]);
  

  useEffect(() => {
    if (startClassMutation.isSuccess || endClassMutation.isSuccess) {
      refetchClassDetail();

      if (onRefreshClasses) {
        setTimeout(() => {
          onRefreshClasses();
        }, 500);
      }
      

      if (endClassMutation.isSuccess && event?.id) {
        localStorage.removeItem(`class_timer_state_${event.id}`);
        localStorage.removeItem(`class_start_time_${event.id}`);
      }
    }
  }, [startClassMutation.isSuccess, endClassMutation.isSuccess, refetchClassDetail, onRefreshClasses, event?.id]);


  useEffect(() => {
    if (isOpen && event?.id) {

      refetchClassDetail();
      
     
      if (event.status === 'in_progress') {
        const storedStartTime = localStorage.getItem(`class_start_time_${event.id}`);
        if (storedStartTime) {
          setActualClassStartTime(new Date(storedStartTime));
        } else if (!actualClassStartTime) {
          const now = new Date();
          setActualClassStartTime(now);
          localStorage.setItem(`class_start_time_${event.id}`, now.toISOString());
        }
      }
    }
  }, [isOpen, event?.id, refetchClassDetail, event?.status, actualClassStartTime]);

 
  useEffect(() => {
    if (event?.id && !isOpen) {
      refetchClassDetail();
    }
  }, [event?.id, isOpen, refetchClassDetail]);

  useEffect(() => {
    if (event?.id) {
      refetchClassDetail();
    }
  }, [event?.id, refetchClassDetail]);

  const isLoading = startClassMutation.isPending || 
                   endClassMutation.isPending || 
                   cancelClassMutation.isPending;

  
  if (!event) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clase no encontrada</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>No se pudo cargar la información de la clase.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 

 
  const handleStartClass = async () => {
    const startTime = new Date();
    setActualClassStartTime(startTime);
    localStorage.setItem(`class_start_time_${event.id}`, startTime.toISOString());
    await startClassMutation.mutateAsync({
      classId: event.id,
      sessionDate: startTime
    });
  };

  const handleEndClass = async () => {
   
    if (!hasTakenAttendance && (!classDetail?.enrolledMembers || classDetail.enrolledMembers.length === 0)) {
      toast.error('Debes tomar asistencia antes de terminar la clase', {
        description: 'Por favor, primero toma la asistencia de los alumnos inscritos.'
      });
      return;
    }

  
    const membersWithAttendance = classDetail?.enrolledMembers?.filter(m => m.attendanceStatus) || [];
    if (membersWithAttendance.length === 0) {
      toast.error('Debes tomar asistencia antes de terminar la clase', {
        description: 'Por favor, primero toma la asistencia de los alumnos inscritos.'
      });
      return;
    }

    
    const storageKey = `class_timer_state_${event.id}`;
    const finalTimeKey = `class_timer_final_${event.id}`;
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const { startTime: savedStartTime } = JSON.parse(savedState);
        const realStartTime = new Date(savedStartTime);
        const now = Date.now();
        const elapsed = Math.max(0, now - realStartTime.getTime());
        const scheduledDuration = event.end.getTime() - event.start.getTime();
        const isOvertime = elapsed > scheduledDuration;
        const overtime = isOvertime ? elapsed - scheduledDuration : 0;
        
        const finalTime = { elapsed, isOvertime, overtime };
        setFinalClassTime(finalTime);
        
       
        localStorage.setItem(finalTimeKey, JSON.stringify(finalTime));
      } catch {
      }
    }

    localStorage.removeItem(`class_start_time_${event.id}`);
    localStorage.removeItem(storageKey);
    setActualClassStartTime(null);

    await endClassMutation.mutateAsync({
      sessionId: event.id,
      endTime: new Date(),
      attendees: []
    });
  };


  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(ms).padStart(2, '0')
    };
  };


  const getAttendanceBadgeColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'present':
      case 'presente':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'late':
      case 'tarde':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'absent':
      case 'ausente':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };


  const getAttendanceLabel = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'present':
      case 'presente':
        return 'Presente';
      case 'late':
      case 'tarde':
        return 'Tarde';
      case 'absent':
      case 'ausente':
        return 'Ausente';
      default:
        return 'Sin registrar';
    }
  };

  const handleRefreshStudents = async () => {
    setIsRefreshingStudents(true);
    try {
      await refetchClassDetail();
    } finally {
      setIsRefreshingStudents(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[95vh] overflow-y-auto w-[98vw] min-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{event.title}</span>
            <Badge className={cn("ml-2 rounded-md px-3 py-1", CLASS_STATUS_COLORS[currentStatus || event.status])}>
              {CLASS_STATUS_LABELS[currentStatus || event.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Columna Izquierda - Información de la clase */}
          <div className="xl:col-span-1 space-y-4">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Información de la Clase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{format(event.start, 'EEEE, dd MMMM')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                  <Users className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{event.enrolledCount}/{event.capacity} alumnos inscritos</p>
                  </div>
                </div>
                {event.description && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium text-sm mb-2">Descripción</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Columna Derecha - Cronómetro */}
          <div className="xl:col-span-2">
            {currentStatus === 'in_progress' && (
              <ClassTimer
                key={`timer-${event.id}-${isOpen}`}
                startTime={event.start}
                endTime={event.end}
                status={currentStatus || event.status}
                actualStartTime={actualClassStartTime || undefined}
                classId={event.id}
              />
            )}
            {currentStatus !== 'in_progress' && !finalClassTime && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  El cronómetro se mostrará cuando la clase esté en progreso
                </CardContent>
              </Card>
            )}
            
            {currentStatus === 'completed' && finalClassTime && (
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Resumen de Duración de la Clase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Tiempo Programado</div>
                    <div className="text-lg font-semibold">
                      {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Duración: {formatTime(event.end.getTime() - event.start.getTime()).hours}:{formatTime(event.end.getTime() - event.start.getTime()).minutes}:{formatTime(event.end.getTime() - event.start.getTime()).seconds}
                    </div>
                  </div>

                  <div className={`p-6 rounded-lg text-center transition-colors ${
                    finalClassTime.isOvertime ? 'bg-red-500/10 border-2 border-red-500/30' : 'bg-primary/5 border-2 border-primary/20'
                  }`}>
                    <div className="text-xs text-muted-foreground mb-2">
                      {finalClassTime.isOvertime ? 'Tiempo Total Transcurrido' : 'Tiempo Transcurrido'}
                    </div>
                    <div className="text-4xl font-mono font-bold">
                      {formatTime(finalClassTime.elapsed).hours}:{formatTime(finalClassTime.elapsed).minutes}:{formatTime(finalClassTime.elapsed).seconds}
                      <span className="text-2xl">.{formatTime(finalClassTime.elapsed).milliseconds}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      H : M : S : MS
                    </div>
                  </div>

                  {finalClassTime.isOvertime && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="text-xs text-red-600 font-medium mb-1">⚠️ Tiempo Adicional</div>
                      <div className="text-xl font-mono font-bold text-red-600">
                        +{formatTime(finalClassTime.overtime).hours}:{formatTime(finalClassTime.overtime).minutes}:{formatTime(finalClassTime.overtime).seconds}.{formatTime(finalClassTime.overtime).milliseconds}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Lista de alumnos - Ocupa todo el ancho abajo */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Alumnos Inscritos ({classDetail?.enrolledMembers?.length || event.members.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStudents}
                disabled={isRefreshingStudents}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshingStudents ? 'animate-spin' : ''}`} />
                {isRefreshingStudents ? 'Cargando...' : 'Refrescar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingClassDetail ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Cargando estudiantes...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {(classDetail?.enrolledMembers || event.members).map((member, index) => (
                <div key={`member-${member.id || index}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      {member.phone && (
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    {member.attendanceStatus && (
                      <Badge className={cn("ml-2 rounded-md px-3 py-1", getAttendanceBadgeColor(member.attendanceStatus))}>
                        {getAttendanceLabel(member.attendanceStatus)}
                      </Badge>
                    )}
                  </div>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-3">
            {currentStatus === 'in_progress' && (
              <Button 
                onClick={() => {
                
                  navigate('/trainer/attendance', { 
                    state: { classId: event.id, autoOpen: true }
                  });
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Tomar Asistencia
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            
            {currentStatus === 'scheduled' && (
              <Button 
                onClick={handleStartClass}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? 'Iniciando...' : 'Iniciar Clase'}
              </Button>
            )}
            
            {currentStatus === 'in_progress' && (
              <Button 
                onClick={handleEndClass}
                disabled={isLoading || !hasTakenAttendance}
                variant="destructive"
                title={!hasTakenAttendance ? 'Debes tomar asistencia antes de terminar la clase' : ''}
              >
                <Square className="h-4 w-4 mr-2" />
                {isLoading ? 'Terminando...' : !hasTakenAttendance ? 'Tomar asistencia primero' : 'Terminar Clase'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
