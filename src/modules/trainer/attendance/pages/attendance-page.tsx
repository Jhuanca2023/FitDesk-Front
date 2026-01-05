import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { cn } from '@/core/lib/utils';
import { useTrainerClass, useEndClass, useClassesByDateRange } from '../../calendar/hooks/use-trainer-classes';
import { TrainerClassService } from '../../calendar/services/trainer-class.service';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface AttendanceRecord {
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: AttendanceStatus;
  notes?: string;
}

const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Presente',
  absent: 'Ausente',
  late: 'Tarde'
};

const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  absent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  late: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
};

export default function AttendanceMainPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classIdFromCalendar, setClassIdFromCalendar] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  

  const { data: classDetail, isLoading: isLoadingClass } = useTrainerClass(classIdFromCalendar || '');
  const endClassMutation = useEndClass();
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 90);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);
  
  const { data: trainerClasses } = useClassesByDateRange(startDate, endDate);
  
  const classesArray = Array.isArray(trainerClasses) ? trainerClasses : [];
  
  const completedClasses = classesArray.filter(
    (cls: any) => {
      const status = cls.status?.toLowerCase();
      const matches = status === 'completed' || status === 'completada' || 
             status === 'in_progress' || status === 'en_proceso' ||
             status === 'en_progreso';
      return matches;
    }
  ).sort((a: any, b: any) => {
    const dateA = new Date(a.classDate).getTime();
    const dateB = new Date(b.classDate).getTime();
    return dateB - dateA;
  }).slice(0, 5);


  useEffect(() => {
    const state = location.state as { classId?: string; autoOpen?: boolean } | null;
    
    if (state?.classId && state?.autoOpen) {
      setClassIdFromCalendar(state.classId);
      window.history.replaceState({}, '');
    }
  }, [location.state]);
  

  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  useEffect(() => {
    if (classDetail && classIdFromCalendar) {
      const initialRecords: Record<string, AttendanceRecord> = {};
      classDetail.enrolledMembers.forEach(member => {
        const normalizeStatus = (status: string | undefined): AttendanceStatus => {
          if (!status) return 'present';
          const normalized = status.toLowerCase();
          if (normalized === 'presente') return 'present';
          if (normalized === 'ausente') return 'absent';
          if (normalized === 'tarde') return 'late';
          if (normalized === 'present') return 'present';
          if (normalized === 'absent') return 'absent';
          if (normalized === 'late') return 'late';
          return 'present';
        };
        
        initialRecords[member.id] = {
          memberId: member.id,
          memberName: member.name,
          memberEmail: member.email,
          status: member.attendanceStatus ? normalizeStatus(member.attendanceStatus) : 'present',
        };
      });
      setAttendanceRecords(initialRecords);
      setSessionId(classDetail.id);
      
      if (!isModalOpen && !hasOpenedOnce) {
        setIsModalOpen(true);
        setHasOpenedOnce(true);
      }
    }
  }, [classDetail, classIdFromCalendar, isModalOpen, hasOpenedOnce]);

  const handleStatusChange = (memberId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        status
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!classDetail || !sessionId) return;

    try {
      const attendanceStatusMap: Record<string, string> = {
        'present': 'PRESENTE',
        'absent': 'AUSENTE',
        'late': 'TARDE'
      };
      
      const attendanceData: Record<string, string> = {};
      Object.values(attendanceRecords).forEach(record => {
        attendanceData[record.memberId] = attendanceStatusMap[record.status] || 'AUSENTE';
      });

      await TrainerClassService.saveAttendance(sessionId, attendanceData);
      
      setIsModalOpen(false);
      setClassIdFromCalendar(null);
      navigate('/trainer/calendar');
    } catch (error) {
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Control de Asistencia</h1>
            <p className="text-muted-foreground">
              Gestiona la asistencia de tus clases
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Clases Completadas */}
      {completedClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Clases Recientes con Asistencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {completedClasses.map((cls: any) => {
                return (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setClassIdFromCalendar(cls.id);
                      setIsModalOpen(true);
                      setHasOpenedOnce(false);
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{cls.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(new Date(cls.classDate), 'dd/MM/yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {cls.startTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {cls.location}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de la clase actual */}
      {isLoadingClass ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">Cargando clase...</div>
          </CardContent>
        </Card>
      ) : classDetail ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {classDetail.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{format(new Date(classDetail.classDate), 'EEEE, d MMMM yyyy', { locale: es })}</div>
                  <div className="text-xs text-muted-foreground">Fecha</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{classDetail.startTime} ({classDetail.duration} min)</div>
                  <div className="text-xs text-muted-foreground">Horario</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{classDetail.location}</div>
                  <div className="text-xs text-muted-foreground">Ubicación</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {classDetail.enrolledCount}/{classDetail.capacity} estudiantes
                </Badge>
                <Badge
                  variant={
                    classDetail.status === 'completed' ? 'default' :
                    classDetail.status === 'in_progress' ? 'secondary' :
                    classDetail.status === 'cancelled' ? 'destructive' : 'outline'
                  }
                  className="text-lg px-4 py-2"
                >
                  {classDetail.status === 'scheduled' && 'Programada'}
                  {classDetail.status === 'in_progress' && 'En Progreso'}
                  {classDetail.status === 'completed' && 'Completada'}
                  {classDetail.status === 'cancelled' && 'Cancelada'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2 text-muted-foreground">
              No hay clase seleccionada
            </h3>
            <p className="text-sm text-muted-foreground">
              Selecciona una clase desde el calendario para tomar asistencia
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Asistencia */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setClassIdFromCalendar(null);
          setAttendanceRecords({});
          setSessionId(null);
          setHasOpenedOnce(false);
        }
      }}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col min-w-[1400px] p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">{classDetail?.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{classDetail && format(new Date(classDetail.classDate), 'EEEE, d MMMM yyyy', { locale: es })}</span>
                  <span>•</span>
                  <span>{classDetail?.startTime}</span>
                  <span>•</span>
                  <span>{classDetail?.location}</span>
                </div>
              </div>
              <Badge className="border text-sm px-3 py-1 rounded-md" variant="outline">
                {classDetail?.status === 'completed' ? 'Completada' : 
                 classDetail?.status === 'in_progress' ? 'En Progreso' : 'Programada'}
              </Badge>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalles de asistencia para la clase {classDetail?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-6 mt-4">
          {classDetail && (
            <>
              {/* Columna Izquierda - Información de la clase */}
              <Card className="col-span-1 border-2 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Total</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{classDetail.enrolledMembers.length} alumnos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Presentes</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classDetail.enrolledMembers.filter(m => {
                          const record = attendanceRecords[m.id];
                          const normalized = record?.status?.toLowerCase();
                          return normalized === 'present' || normalized === 'presente';
                        }).length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Ausentes</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classDetail.enrolledMembers.filter(m => {
                          const record = attendanceRecords[m.id];
                          const normalized = record?.status?.toLowerCase();
                          return normalized === 'absent' || normalized === 'ausente';
                        }).length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Tarde</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classDetail.enrolledMembers.filter(m => {
                          const record = attendanceRecords[m.id];
                          const normalized = record?.status?.toLowerCase();
                          return normalized === 'late' || normalized === 'tarde';
                        }).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Columna Derecha - Lista de estudiantes */}
              <Card className="col-span-3 flex flex-col border-2 min-h-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Estudiantes ({classDetail.enrolledMembers.length})</span>
                    <span className="text-sm font-normal text-muted-foreground">Scroll para ver todos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-2 p-1 max-h-[60vh]">
                    {classDetail.enrolledMembers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay estudiantes inscritos en esta clase
                      </div>
                    ) : (
                      classDetail.enrolledMembers.map((member) => {
                      const record = attendanceRecords[member.id];
                      
                      const normalizeStatus = (status: string | undefined): AttendanceStatus => {
                        if (!status) return 'present';
                        const normalized = status.toLowerCase();
                        if (normalized === 'presente') return 'present';
                        if (normalized === 'ausente') return 'absent';
                        if (normalized === 'tarde') return 'late';
                        return normalized as AttendanceStatus;
                      };
                      
                      const status = record ? normalizeStatus(record.status) : (normalizeStatus(member.attendanceStatus) || 'present');
                      const showHistory = (classDetail.status === 'completed' || classDetail.status === 'in_progress');

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md hover:border-primary/50"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{member.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                              {showHistory && (member.attendanceStatus || record) && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge 
                                    className={cn(
                                      "text-xs px-2 py-0.5",
                                      ATTENDANCE_STATUS_COLORS[status as AttendanceStatus]
                                    )}
                                  >
                                    {ATTENDANCE_STATUS_LABELS[status as AttendanceStatus]}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>

                          {classDetail.status !== 'completed' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 px-3">
                                <Badge className={cn("text-xs px-2 py-1", ATTENDANCE_STATUS_COLORS[status as AttendanceStatus])}>
                                  {ATTENDANCE_STATUS_LABELS[status as AttendanceStatus]}
                                </Badge>
                                <MoreHorizontal className="h-4 w-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'present')}>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                Presente
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'late')}>
                                <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                Tarde
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'absent')}>
                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                Ausente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          )}
                        </div>
                      );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Resumen de Asistencia cuando la clase está completada */}
              {classDetail && classDetail.status === 'completed' && (
                <div className="col-span-4 mt-4">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Resumen de Asistencia - Clase Completada
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            {classDetail.enrolledMembers.filter(m => {
                              const status = m.attendanceStatus?.toLowerCase();
                              return status === 'present' || status === 'presente';
                            }).length}
                          </div>
                          <div className="text-sm font-medium text-green-800 dark:text-green-300">Presentes</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                            {classDetail.enrolledMembers.filter(m => {
                              const status = m.attendanceStatus?.toLowerCase();
                              return status === 'late' || status === 'tarde';
                            }).length}
                          </div>
                          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Tarde</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                            {classDetail.enrolledMembers.filter(m => {
                              const status = m.attendanceStatus?.toLowerCase();
                              return status === 'absent' || status === 'ausente' || !m.attendanceStatus;
                            }).length}
                          </div>
                          <div className="text-sm font-medium text-red-800 dark:text-red-300">Ausentes</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                        <div className="text-sm font-semibold mb-2">Historial de Alumnos:</div>
                        {classDetail.enrolledMembers.map((member) => {
                          const normalizeStatus = (status: string | undefined): AttendanceStatus => {
                            if (!status) return 'present';
                            const normalized = status.toLowerCase();
                            if (normalized === 'presente') return 'present';
                            if (normalized === 'ausente') return 'absent';
                            if (normalized === 'tarde') return 'late';
                            return normalized as AttendanceStatus;
                          };
                          
                          const memberStatus = normalizeStatus(member.attendanceStatus);
                          
                          const statusColors = {
                            'present': 'text-green-600 dark:text-green-400',
                            'late': 'text-yellow-600 dark:text-yellow-400',
                            'absent': 'text-red-600 dark:text-red-400'
                          };
                          const statusIcons = {
                            'present': '✓',
                            'late': '⏱',
                            'absent': '✗'
                          };
                          
                          return (
                            <div key={member.id} className="flex items-center justify-between p-2 rounded border">
                              <div className="flex items-center gap-3">
                                <span className={`text-lg ${statusColors[memberStatus as keyof typeof statusColors] || 'text-gray-500'}`}>
                                  {statusIcons[memberStatus as keyof typeof statusIcons] || '○'}
                                </span>
                                <span className="text-sm font-medium">{member.name}</span>
                              </div>
                              <Badge 
                                className={cn(
                                  "text-xs",
                                  ATTENDANCE_STATUS_COLORS[memberStatus as AttendanceStatus]
                                )}
                              >
                                {ATTENDANCE_STATUS_LABELS[memberStatus as AttendanceStatus] || 'Presente'}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
          </div>

          <DialogFooter className="mt-4 pt-4 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
            {classDetail && classDetail.status !== 'completed' && (
              <Button
                onClick={handleSaveAttendance}
                disabled={endClassMutation.isPending}
                className="bg-primary hover:bg-primary/90 min-w-[150px]"
              >
                {endClassMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Guardar Asistencia
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
