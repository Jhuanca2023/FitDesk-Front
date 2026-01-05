import { MoreHorizontal, History, MessageSquare, UserCheck, UserX, Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

import type { Student, StudentStatus, PaginatedResponse } from '../types';
import { StudentsPagination } from './StudentsPagination';

interface StudentsTableProps {
  students: Student[];
  pagination: PaginatedResponse<Student>;
  isLoading: boolean;
  isDeleting?: boolean;
  isClassSpecific?: boolean;
  onStudentDelete: (student: Student) => void;
  onStudentStatusUpdate: (studentId: string, status: StudentStatus) => void;
  onStudentMessage: (student: Student) => void;
  onStudentHistory: (student: Student) => void;
  onPageChange: (page: number) => void;
}

export function StudentsTable({
  students,
  pagination,
  isLoading,
  isDeleting = false,
  isClassSpecific = false,
  onStudentDelete,
  onStudentStatusUpdate,
  onStudentMessage,
  onStudentHistory,
  onPageChange
}: StudentsTableProps) {
  const getStatusText = (status: StudentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-green-600 font-medium">Activo</span>;
      case 'INACTIVE':
        return <span className="text-gray-500 font-medium">Inactivo</span>;
      case 'SUSPENDED':
        return <span className="text-red-600 font-medium">Suspendido</span>;
      default:
        return <span className="text-gray-500 font-medium">{status}</span>;
    }
  };

  const getMembershipText = (membership: string) => {
    const colors = {
      MONTHLY: 'text-blue-600',
      QUARTERLY: 'text-purple-600',
      ANNUAL: 'text-orange-600',
      PREMIUM: 'text-yellow-600'
    };
    
    const labels = {
      MONTHLY: 'Mensual',
      QUARTERLY: 'Trimestral',
      ANNUAL: 'Anual',
      PREMIUM: 'Premium'
    };

    return (
      <span 
        className={`font-medium ${colors[membership as keyof typeof colors] || 'text-gray-500'}`}
      >
        {labels[membership as keyof typeof labels] || membership}
      </span>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Membresía</TableHead>
              <TableHead>Asistencia</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><div className="h-6 w-16 bg-muted rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-6 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 w-12 bg-muted rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Membresía</TableHead>
            <TableHead>Asistencia</TableHead>
            <TableHead>Último acceso</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No se encontraron estudiantes
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(student.firstName, student.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusText(student.status)}
                </TableCell>
                <TableCell>
                  {getMembershipText(student.membership.type)}
                </TableCell>
                <TableCell>
                  {isClassSpecific ? (
                  
                    <Badge variant={
                      (student as any).attendanceStatus === 'present' || (student as any).attendanceStatus === 'PRESENTE' ? 'default' :
                      (student as any).attendanceStatus === 'absent' || (student as any).attendanceStatus === 'AUSENTE' ? 'destructive' :
                      (student as any).attendanceStatus === 'late' || (student as any).attendanceStatus === 'TARDE' ? 'secondary' :
                      'outline'
                    }>
                      {(student as any).attendanceStatus || 'Sin registrar'}
                    </Badge>
                  ) : (
                    // Para vista general, mostrar estadísticas
                    <div className="text-sm">
                      <div className="font-medium">{student.stats.attendanceRate.toFixed(1)}%</div>
                      <div className="text-muted-foreground">
                        {student.stats.totalClasses} clases
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onStudentHistory(student);
                        }}
                      >
                        <History className="mr-2 h-4 w-4" />
                        Historial de asistencia
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStudentMessage(student)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Enviar mensaje
                      </DropdownMenuItem>
                      {!isClassSpecific && (
                        <>
                          <DropdownMenuSeparator />
                          {student.status === 'ACTIVE' ? (
                            <DropdownMenuItem 
                              onClick={() => onStudentStatusUpdate(student.id, 'SUSPENDED')}
                              className="text-orange-600"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspender
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => onStudentStatusUpdate(student.id, 'ACTIVE')}
                              className="text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onStudentDelete(student)}
                            className="text-red-600"
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
      
      <StudentsPagination 
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
