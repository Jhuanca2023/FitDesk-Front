import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  FileText
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import type { AttendanceRecord } from '../types';

interface AttendanceHistoryTableProps {
  attendanceHistory: AttendanceRecord[];
  isLoading?: boolean;
  showStudentInfo?: boolean;
}

export function AttendanceHistoryTable({ 
  attendanceHistory, 
  isLoading,
  showStudentInfo = true 
}: AttendanceHistoryTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-100 text-green-800 border-green-200',
      absent: 'bg-red-100 text-red-800 border-red-200',
      late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      excused: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const labels = {
      present: 'Presente',
      absent: 'Ausente',
      late: 'Tarde',
      excused: 'Justificado',
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[status as keyof typeof labels] || 'Desconocido'}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Historial de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!attendanceHistory || attendanceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Historial de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No hay registros</h3>
            <p className="text-muted-foreground">
              No se encontraron registros de asistencia para mostrar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Historial de Asistencia
          <Badge variant="secondary" className="ml-2">
            {attendanceHistory.length} registros
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Clase</TableHead>
                {showStudentInfo && <TableHead>Estudiante</TableHead>}
                <TableHead>Estado</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(record.date), 'dd MMM yyyy', { locale: es })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(record.date), 'HH:mm', { locale: es })}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{record.className}</div>
                  </TableCell>
                  
                  {showStudentInfo && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(record.studentId)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{record.studentId}</span>
                      </div>
                    </TableCell>
                  )}
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      {getStatusBadge(record.status)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{record.trainer.name}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {record.notes ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-1 cursor-help">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {record.notes.length > 20 
                                  ? `${record.notes.substring(0, 20)}...` 
                                  : record.notes
                                }
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{record.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
