import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Loader2, User } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TrainersTable } from '../components/TrainersTable';
import { TrainerDetailView } from '../components/TrainerDetailView';
import { PageHeader } from '@/shared/components/page-header';
import { useTrainers } from '../hooks/use-trainers';
import type { Trainer } from '../types';


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function TrainersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  
 
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const filters = useMemo(() => ({
    searchTerm: debouncedSearchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    limit: 10,
  }), [debouncedSearchQuery, statusFilter, currentPage]);
  
  const { trainers, pagination, isLoading, error, deleteTrainer } = useTrainers(filters);

  const handleCreate = () => {
    navigate('nuevo');
  };

  const handleEdit = (trainer: Trainer) => {
    navigate(`editar/${trainer.id}`);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteTrainer(id);
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedTrainer(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Error al cargar los entrenadores. Por favor, inténtalo de nuevo.
      </div>
    );
  }

  if (showDetailView && selectedTrainer) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <TrainerDetailView
          trainer={selectedTrainer}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <PageHeader title="Gestión de Entrenadores" />
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar entrenadores..."
              className="pl-9 w-64"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
              <SelectItem value="SUSPENDED">Suspendido</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Entrenador
          </Button>
        </div>
      </div>

      {trainers.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <User className="h-14 w-14 text-muted-foreground" />
            <h3 className="text-xl font-medium">No hay entrenadores registrados</h3>
            <p className="text-muted-foreground max-w-md">
              Comienza creando un nuevo entrenador.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <TrainersTable
            trainers={trainers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
          
          {/* Información de paginación y controles */}
          {pagination && pagination.total > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}-{Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} entrenadores
                </p>
              </div>
              
              {/* Controles de paginación */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TrainersPage;
