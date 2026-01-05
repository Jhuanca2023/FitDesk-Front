import { useState, useMemo } from 'react';
import { ArrowLeft, Filter, User, Calendar, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { Student, AttendanceStatus } from '../types';

interface StudentAttendanceHistoryViewProps {
  student: Student;
  classId?: string; // ID de la clase seleccionada para filtrar
  onBack: () => void;
}
export function StudentAttendanceHistoryView({
  student,
  classId,
  onBack
}: StudentAttendanceHistoryViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Obtener clases completadas del trainer
  const { data: classesData } = useQuery({
    queryKey: ['trainer-classes-for-history'],
    queryFn: async () => {
      const response = await fitdeskApi.get<any[]>(
        `/classes/stadistic/my-classes/stats`
      );
      return response.data || [];
    }
  });

  // Obtener detalles de cada clase completada para saber si el estudiante está inscrito
  const { data: detailedClasses } = useQuery({
    queryKey: ['detailed-classes', classesData],
    queryFn: async () => {
      if (!classesData || classesData.length === 0) return [];
      
      const completedClassIds = classesData
        .filter((cls: any) => {
          const status = cls.status?.toLowerCase();
          return status === 'completed' || status === 'completada';
        })
        .map((cls: any) => cls.id);
      
      // Si hay una clase específica seleccionada, solo obtener esa clase
      const idsToFetch = classId 
        ? [classId] 
        : completedClassIds.slice(0, 5);
      
      const detailsPromises = idsToFetch.map(id => 
        fitdeskApi.get(`/classes/stadistic/${id}/detail`)
          .then(res => res.data)
          .catch(() => null)
      );
      
      return Promise.all(detailsPromises).then(results => 
        results.filter(r => r !== null)
      );
    },
    enabled: !!classesData && classesData.length > 0
  });

  // Filtrar clases completadas donde el estudiante esté inscrito
  const attendanceRecords = useMemo(() => {
    if (!detailedClasses || detailedClasses.length === 0) return [];
    
    return detailedClasses
      .filter((cls: any) => {
        return cls.students?.some((s: any) => s.memberId === student.id || s.id === student.id);
      })
      .map((cls: any) => {
        const studentData = cls.students?.find((s: any) => s.memberId === student.id || s.id === student.id);
        
        // Parsear fecha
        const [day, month, year] = cls.classDate.split('-');
        const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Normalizar estado de asistencia
        const normalizeStatus = (status: string | undefined): AttendanceStatus => {
          if (!status) return 'absent';
          const normalized = status.toLowerCase();
          if (normalized === 'presente' || normalized === 'present') return 'present';
          if (normalized === 'ausente' || normalized === 'absent') return 'absent';
          if (normalized === 'tarde' || normalized === 'late') return 'late';
          return 'absent';
        };

        return {
          id: cls.id,
          studentId: student.id,
          classId: cls.id,
          className: cls.className,
          date: classDate.toISOString(),
          status: normalizeStatus(studentData?.attendanceStatus),
          trainer: {
            id: '',
            name: cls.trainerName || 'Entrenador'
          }
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [detailedClasses, student.id]);


  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const filteredHistory = statusFilter === 'all' 
    ? attendanceRecords 
    : attendanceRecords.filter((record) => record.status === statusFilter);

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === 'present').length,
    absent: attendanceRecords.filter((r) => r.status === 'absent').length,
    late: attendanceRecords.filter((r) => r.status === 'late').length || 0  
  };

  const attendanceRate = stats.total > 0 ? ((stats.present + stats.late) / stats.total * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Estudiantes
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(student.firstName, student.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Historial de Asistencia</h1>
              <p className="text-muted-foreground">
                {student.firstName} {student.lastName}
              </p>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm">
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Clases</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">0 de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Presente</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground">{stats.present} de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Ausente</CardTitle>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <X className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">{stats.absent} de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Tarde</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">{stats.late} de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <User className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-cyan-600">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrar por estado:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="present">Presente</SelectItem>
            <SelectItem value="absent">Ausente</SelectItem>
            <SelectItem value="late">Tarde</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de historial */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Clase</TableHead>
              <TableHead className="text-center">A</TableHead>
              <TableHead className="text-center">T</TableHead>
              <TableHead className="text-center">F</TableHead>
              <TableHead>Trainer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron registros de asistencia
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{record.className}</div>
                  </TableCell>
                  {/* Columna A (Asistió) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'present' 
                          ? 'bg-green-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      }`}
                    >
                    </div>
                  </TableCell>
                  {/* Columna T (Tardanza) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'late' 
                          ? 'bg-orange-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      }`}
                    >
                    </div>
                  </TableCell>
                  {/* Columna F (Faltó) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'absent' 
                          ? 'bg-red-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      }`}
                    >
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{record.trainer.name}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
