import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/core/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Separator } from '@/shared/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  Square,
  UserCheck,
  UserX,
  MoreHorizontal,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAttendanceStore } from '../store/attendance-store';
import { useMarkAttendance, useBulkUpdateAttendance, useCompleteAttendanceSession } from '../hooks/use-attendance';
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS, type AttendanceStatus } from '../types';
import { toast } from 'sonner';

interface AttendanceSessionModalProps {
  sessionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceSessionModal({ sessionId, open, onOpenChange }: AttendanceSessionModalProps) {
  const { currentSession, getSessionById } = useAttendanceStore();
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  const session = sessionId ? getSessionById(sessionId) || currentSession : null;

  const markAttendanceMutation = useMarkAttendance();
  const bulkUpdateMutation = useBulkUpdateAttendance();
  const completeSessionMutation = useCompleteAttendanceSession();

  const sessionStats = useMemo(() => {
    if (!session) return null;

    const total = session.totalMembers;
    const present = session.presentCount;
    const absent = session.absentCount;
    const late = session.lateCount;
    const excused = session.excusedCount;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;

    return { total, present, absent, late, excused, attendanceRate };
  }, [session]);

  const filteredMembers = useMemo(() => {
    if (!session?.attendanceRecords) return [];
    
    if (!memberSearchTerm.trim()) {
      return session.attendanceRecords;
    }
    
    const searchLower = memberSearchTerm.toLowerCase();
    return session.attendanceRecords.filter(record => 
      record.memberName.toLowerCase().includes(searchLower) ||
      record.memberEmail.toLowerCase().includes(searchLower)
    );
  }, [session?.attendanceRecords, memberSearchTerm]);

  if (!session) return null;

  const handleMarkAttendance = async (memberId: string, status: AttendanceStatus) => {
    try {
      await markAttendanceMutation.mutateAsync({
        sessionId: session.id,
        memberId,
        status
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      setHasUnsavedChanges(true);
    }
  };

  const handleBulkUpdate = async (status: AttendanceStatus) => {
    if (selectedMembers.size === 0) {
      toast.error('Selecciona al menos un miembro');
      return;
    }

    try {
      const updates = Array.from(selectedMembers).map(memberId => ({
        memberId,
        status
      }));

      await bulkUpdateMutation.mutateAsync({
        sessionId: session.id,
        updates
      });

      setSelectedMembers(new Set());
      setHasUnsavedChanges(false);
    } catch (error) {
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      toast.success('Todos los cambios han sido guardados correctamente');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Error al guardar los cambios');
    }
  };

  const handleCompleteSession = async () => {
    try {
      await completeSessionMutation.mutateAsync({
        sessionId: session.id,
        endTime: new Date(),
        notes: session.notes || ''
      });
      onOpenChange(false);
    } catch (error) {
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);
  };

  const selectAllMembers = () => {
    setSelectedMembers(new Set(session.attendanceRecords.map(r => r.memberId)));
  };

  const clearSelection = () => {
    setSelectedMembers(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="!max-w-none !w-[96vw] !h-[96vh] !top-[2vh] !left-[2vw] !translate-x-0 !translate-y-0 overflow-hidden p-4 flex flex-col fixed"
        style={{ 
          width: '96vw', 
          height: '96vh',
          maxWidth: 'none',
          maxHeight: 'none',
          top: '2vh',
          left: '2vw',
          transform: 'none'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {session.className}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {format(new Date(session.date), 'EEEE, d MMMM yyyy', { locale: es })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(session.startTime), 'HH:mm')}
              {session.endTime && ` - ${format(new Date(session.endTime), 'HH:mm')}`}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {session.location}
            </div>
            <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
              {session.status === 'scheduled' && 'Programada'}
              {session.status === 'in_progress' && 'En Progreso'}
              {session.status === 'completed' && 'Completada'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 py-4 flex-1 overflow-hidden">
          {/* Estadísticas */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{sessionStats?.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionStats?.present}</div>
                    <div className="text-sm text-muted-foreground">Presentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{sessionStats?.absent}</div>
                    <div className="text-sm text-muted-foreground">Ausentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{sessionStats?.late}</div>
                    <div className="text-sm text-muted-foreground">Tarde</div>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {sessionStats?.attendanceRate.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Asistencia</div>
                </div>

                {/* Acciones rápidas */}
                {selectedMembers.size > 0 && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="text-sm font-medium">
                      {selectedMembers.size} miembro(s) seleccionado(s)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkUpdate('present')}
                        disabled={bulkUpdateMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Presente
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkUpdate('absent')}
                        disabled={bulkUpdateMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Ausente
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearSelection}
                      className="w-full"
                    >
                      Limpiar selección
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Lista de miembros */}
          <div className="lg:col-span-4 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Miembros ({filteredMembers.length}/{session.attendanceRecords.length})
                  </CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar miembro por nombre o email..."
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={selectAllMembers}
                    >
                      Seleccionar todos
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkUpdate('present')}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Marcar todos presente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkUpdate('absent')}>
                          <UserX className="h-4 w-4 mr-2" />
                          Marcar todos ausente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                <div 
                  className="flex-1 overflow-y-auto" 
                  style={{
                    maxHeight: '70vh',
                    minHeight: '400px'
                  }}
                >
                  <div className="space-y-3 p-6 pb-16">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((record) => (
                        <MemberAttendanceRow
                          key={record.memberId}
                          record={record}
                          isSelected={selectedMembers.has(record.memberId)}
                          onSelect={() => toggleMemberSelection(record.memberId)}
                          onStatusChange={(status) => handleMarkAttendance(record.memberId, status)}
                          isUpdating={markAttendanceMutation.isPending}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                          No se encontraron miembros
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {memberSearchTerm ? 
                            `No hay miembros que coincidan con "${memberSearchTerm}"` :
                            'No hay miembros en esta sesión'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={handleSaveChanges}
              disabled={markAttendanceMutation.isPending || bulkUpdateMutation.isPending || !hasUnsavedChanges}
            >
              {markAttendanceMutation.isPending || bulkUpdateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {hasUnsavedChanges ? 'Guardar Cambios' : 'Todo Guardado'}
                </>
              )}
            </Button>
            {session.status !== 'completed' && (
              <Button
                onClick={handleCompleteSession}
                disabled={completeSessionMutation.isPending}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Completar Sesión
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MemberAttendanceRowProps {
  record: {
    id: string;
    memberName: string;
    memberEmail?: string;
    memberAvatar?: string;
    status: AttendanceStatus;
    notes?: string;
    checkInTime?: Date;
  };
  isSelected: boolean;
  onSelect: () => void;
  onStatusChange: (status: AttendanceStatus) => void;
  isUpdating: boolean;
}

function MemberAttendanceRow({ 
  record, 
  isSelected, 
  onSelect, 
  onStatusChange, 
  isUpdating 
}: MemberAttendanceRowProps) {
  const statusIcons = {
    present: CheckCircle2,
    absent: XCircle,
    late: Clock,
    excused: Shield
  };

  const StatusIcon = statusIcons[record.status as AttendanceStatus];

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 min-h-[80px] w-full",
        {
          "bg-accent border-primary": isSelected,
          "opacity-50": isUpdating
        }
      )}
      onClick={onSelect}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={record.memberAvatar} />
        <AvatarFallback>
          {record.memberName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-base truncate">{record.memberName}</div>
        <div className="text-sm text-muted-foreground truncate">{record.memberEmail}</div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1 px-3 py-1",
            ATTENDANCE_STATUS_COLORS[record.status as AttendanceStatus]
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {ATTENDANCE_STATUS_LABELS[record.status as AttendanceStatus]}
        </Badge>

        {record.checkInTime && (
          <div className="text-xs text-muted-foreground font-mono">
            {format(new Date(record.checkInTime), 'HH:mm')}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" disabled={isUpdating} className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange('present')}>
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              Presente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('absent')}>
              <XCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
              Ausente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('late')}>
              <Clock className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
              Tarde
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('excused')}>
              <Shield className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Justificado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
