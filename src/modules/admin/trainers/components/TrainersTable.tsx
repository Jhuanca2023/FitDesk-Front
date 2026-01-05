import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  User, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import type { Trainer } from '../types';


const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const TRAINER_STATUS = {
  ACTIVE: {
    label: 'Activo',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  INACTIVE: {
    label: 'Inactivo',
    icon: XCircle,
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
    iconColor: 'text-gray-500 dark:text-gray-400'
  },
  SUSPENDED: {
    label: 'Suspendido',
    icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:hover:bg-yellow-900/50',
    iconColor: 'text-yellow-600 dark:text-yellow-500'
  },
  PENDING: {
    label: 'Pendiente',
    icon: Clock,
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
} as const;

interface TrainersTableProps {
  trainers: Trainer[];
  onEdit: (trainer: Trainer) => void;
  onDelete: (id: string) => Promise<void>;
  onViewDetails: (trainer: Trainer) => void;
}

export function TrainersTable({ trainers, onEdit, onDelete, onViewDetails }: TrainersTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
 
  const renderStatusBadge = (status: string | undefined) => {
    const { icon: StatusIcon, label, color, iconColor } = getStatusConfig(status);
    
    return (
      <div className="flex items-center">
        <div className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
          color
        )}>
          <StatusIcon className={cn("mr-1.5 h-3.5 w-3.5", iconColor)} />
          {label}
        </div>
      </div>
    );
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await onDelete(id);
      toast.success('Entrenador eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el entrenador:', error);
      toast.error('No se pudo eliminar el entrenador. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDeleting(null);
    }
  };

 
  const getStatusConfig = (status: string | undefined) => {
    if (!status) {
      return TRAINER_STATUS.INACTIVE;
    }
    
    const statusKey = status as keyof typeof TRAINER_STATUS;
    return TRAINER_STATUS[statusKey] || TRAINER_STATUS.INACTIVE;
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Entrenador</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead className="w-[140px]">Estado</TableHead>
            <TableHead className="w-[120px]">Experiencia</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No se encontraron entrenadores
              </TableCell>
            </TableRow>
          ) : (
            trainers.map((trainer) => (
                <TableRow 
                  key={trainer.id} 
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                        {trainer.profileImage && typeof trainer.profileImage === 'string' ? (
                          <img
                            src={trainer.profileImage}
                            alt={`${trainer.firstName} ${trainer.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => onViewDetails(trainer)}
                          className="font-medium truncate text-left hover:text-primary transition-colors cursor-pointer"
                        >
                          {trainer.firstName} {trainer.lastName}
                        </button>
                        <div className="text-xs text-muted-foreground truncate">
                          {trainer.specialties}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {trainer.email}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-mono text-sm">{trainer.documentNumber}</div>
                  </TableCell>
                  
                  <TableCell>
                    {renderStatusBadge(trainer.status)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">{trainer.yearsOfExperience}</span>
                      <span className="text-muted-foreground ml-1">
                        {trainer.yearsOfExperience === 1 ? 'año' : 'años'}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(trainer)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalles</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(trainer)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => trainer.id && handleDelete(trainer.id)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                          disabled={isDeleting === trainer.id || !trainer.id}
                        >
                          {isDeleting === trainer.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
