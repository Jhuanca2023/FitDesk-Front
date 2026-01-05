import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  MoreVertical,
  MessageCircle,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Progress } from '@/shared/components/ui/progress';

import type { Student, StudentStatus } from '../types';

interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onUpdateStatus?: (studentId: string, status: StudentStatus) => void;
  onSendMessage?: (student: Student) => void;
  onViewDetails?: (student: Student) => void;
}

export function StudentCard({ 
  student, 
  onEdit, 
  onDelete, 
  onUpdateStatus, 
  onSendMessage,
  onViewDetails 
}: StudentCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMembershipColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXPIRED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleStatusChange = async (newStatus: StudentStatus) => {
    if (onUpdateStatus) {
      setIsLoading(true);
      try {
        await onUpdateStatus(student.id, newStatus);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" 
          onClick={() => onViewDetails?.(student)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.profileImage} alt={`${student.firstName} ${student.lastName}`} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(student.firstName, student.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-none">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Miembro desde {format(new Date(student.joinDate), 'MMM yyyy', { locale: es })}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(student); }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSendMessage?.(student); }}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar mensaje
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {student.status === 'ACTIVE' ? (
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange('SUSPENDED'); }}
                  disabled={isLoading}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Suspender
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); handleStatusChange('ACTIVE'); }}
                  disabled={isLoading}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete?.(student); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estados */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getStatusColor(student.status)}>
            {student.status === 'ACTIVE' ? 'Activo' : 
             student.status === 'INACTIVE' ? 'Inactivo' : 'Suspendido'}
          </Badge>
          <Badge variant="outline" className={getMembershipColor(student.membership.status)}>
            {student.membership.type}
          </Badge>
        </div>

        {/* Información de contacto */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            <span>{student.phone}</span>
          </div>
        </div>

        {/* Estadísticas de asistencia */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Asistencia</span>
            <span className="font-medium">{student.stats.attendanceRate.toFixed(1)}%</span>
          </div>
          <Progress value={student.stats.attendanceRate} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{student.stats.attendedClasses} de {student.stats.totalClasses} clases</span>
            <div className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>{student.stats.currentStreak} racha</span>
            </div>
          </div>
        </div>

        {/* Membresía */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Vence</span>
            </div>
            <span className="font-medium">
              {format(new Date(student.membership.endDate), 'dd MMM yyyy', { locale: es })}
            </span>
          </div>
        </div>

        {/* Última actividad */}
        {student.lastActivity && (
          <div className="text-xs text-muted-foreground">
            Última actividad: {format(new Date(student.lastActivity), 'dd MMM, HH:mm', { locale: es })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
