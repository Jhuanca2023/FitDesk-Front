import { Grid, List } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/shared/components/ui/pagination';
import { StudentCard } from './StudentCard';
import type { Student, StudentStatus } from '../types';

interface StudentsGridProps {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onPageChange?: (page: number) => void;
  onStudentEdit?: (student: Student) => void;
  onStudentDelete?: (student: Student) => void;
  onStudentStatusUpdate?: (studentId: string, status: StudentStatus) => void;
  onStudentMessage?: (student: Student) => void;
  onStudentDetails?: (student: Student) => void;
}

export function StudentsGrid({
  students,
  pagination,
  isLoading,
  viewMode = 'grid',
  onViewModeChange,
  onPageChange,
  onStudentEdit,
  onStudentDelete,
  onStudentStatusUpdate,
  onStudentMessage,
  onStudentDetails
}: StudentsGridProps) {
  // TODO: Implementar selección múltiple si es necesario
  // const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="flex items-center space-x-2">
            <div className="h-9 w-24 bg-muted animate-pulse rounded" />
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            Mis Estudiantes
            {pagination.total > 0 && (
              <span className="ml-2 text-lg font-normal text-muted-foreground">
                ({pagination.total})
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Cambiar vista */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange?.('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Información de paginación */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
            {pagination.total} estudiantes
          </div>
          <div>
            Página {pagination.page} de {pagination.totalPages}
          </div>
        </div>
      )}

      {/* Grid de estudiantes */}
      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-muted-foreground/50">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">No hay estudiantes</h3>
          <p className="text-muted-foreground">
            No se encontraron estudiantes que coincidan con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-4"
        }>
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={onStudentEdit}
              onDelete={onStudentDelete}
              onUpdateStatus={onStudentStatusUpdate}
              onSendMessage={onStudentMessage}
              onViewDetails={onStudentDetails}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange?.(Math.max(1, pagination.page - 1))}
                  className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => onPageChange?.(pageNumber)}
                      isActive={pagination.page === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1))}
                  className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
