import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/core/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Eye
} from 'lucide-react';
import { useAttendanceStore } from '../store/attendance-store';
import { useAttendanceSessions } from '../hooks/use-attendance';
import type { AttendanceSession, AttendanceFilters } from '../types';

interface SessionListProps {
  onSessionClick?: (sessionId: string) => void;
  onStartSession?: (sessionId: string) => void;
  onCompleteSession?: (sessionId: string) => void;
}

export function SessionList({ onSessionClick, onStartSession, onCompleteSession }: SessionListProps) {
  const {
    filters,
    searchTerm,
    pagination,
    setFilters,
    setSearchTerm,
    goToPage,
    nextPage,
    prevPage
  } = useAttendanceStore();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const { data, isLoading, error } = useAttendanceSessions({
    page: pagination.page,
    limit: pagination.limit,
    filters: {
      ...filters,
      searchTerm: searchTerm || undefined
    }
  });

  const sessions = data?.data || [];

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  };

  const handleFilterChange = (key: keyof AttendanceFilters, value: unknown) => {
    setFilters({ [key]: value });
  };


  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            Error al cargar las sesiones. Intenta nuevamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por clase o ubicación..."
                value={localSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="scheduled">Programada</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.location || 'all'}
              onValueChange={(value) => handleFilterChange('location', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                <SelectItem value="Sala Principal">Sala Principal</SelectItem>
                <SelectItem value="Sala de Yoga">Sala de Yoga</SelectItem>
                <SelectItem value="Gimnasio">Gimnasio</SelectItem>
                <SelectItem value="Piscina">Piscina</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setSearchTerm('');
                setLocalSearchTerm('');
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de sesiones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Sesiones de Asistencia
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {pagination.total} sesiones encontradas
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-muted h-12 w-12"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No se encontraron sesiones con los filtros aplicados.
            </div>
          ) : (
            <div className="divide-y">
              {sessions.map((session) => (
                <SessionListItem
                  key={session.id}
                  session={session}
                  onClick={() => onSessionClick?.(session.id)}
                  onStart={() => onStartSession?.(session.id)}
                  onComplete={() => onCompleteSession?.(session.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={!pagination.hasPrev}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!pagination.hasNext}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface SessionListItemProps {
  session: AttendanceSession;
  onClick: () => void;
  onStart: () => void;
  onComplete: () => void;
}

function SessionListItem({ session, onClick, onStart, onComplete }: SessionListItemProps) {
  const attendanceRate = session.totalMembers > 0 ? (session.presentCount / session.totalMembers) * 100 : 0;

  return (
    <div className="p-6 hover:bg-accent/50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{session.className}</h3>
              <Badge className={cn(
                "text-xs",
                session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                session.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              )}>
                {session.status === 'scheduled' ? 'Programada' :
                 session.status === 'in_progress' ? 'En Progreso' :
                 session.status === 'completed' ? 'Completada' :
                 session.status === 'cancelled' ? 'Cancelada' :
                 session.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(new Date(session.date), 'EEEE, d MMM', { locale: es })}
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
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {session.presentCount}/{session.totalMembers}
              </div>
            </div>

            {session.status === 'completed' && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Asistencia: {attendanceRate.toFixed(0)}%</span>
                  <span>{session.presentCount} presentes</span>
                </div>
                <Progress value={attendanceRate} className="h-1" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.status === 'scheduled' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          )}

          {session.status === 'in_progress' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
            >
              <Square className="h-4 w-4 mr-1" />
              Completar
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalles
          </Button>
        </div>
      </div>

      {/* Vista previa de miembros */}
      {session.attendanceRecords.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Miembros:</span>
            <div className="flex -space-x-2">
              {session.attendanceRecords.slice(0, 5).map((record) => (
                <Avatar key={record.memberId} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={record.memberAvatar} />
                  <AvatarFallback className="text-xs">
                    {record.memberName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {session.attendanceRecords.length > 5 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{session.attendanceRecords.length - 5}
                  </span>
                </div>
              )}
            </div>
            {session.status === 'completed' && (
              <div className="ml-auto flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {session.presentCount}
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-3 w-3" />
                  {session.absentCount}
                </div>
                {session.lateCount > 0 && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Clock className="h-3 w-3" />
                    {session.lateCount}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
