import { useState, useEffect } from 'react';
import { Search, X, Users } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
// Comentado temporalmente - no se usa en la implementación actual
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/shared/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Label } from '@/shared/components/ui/label';

import type { StudentFilters as StudentFiltersType, StudentStatus } from '../types';

interface StudentFiltersProps {
  filters: StudentFiltersType;
  onFiltersChange: (filters: Partial<StudentFiltersType>) => void;
  onClearFilters: () => void;
}

export function StudentFilters({ filters, onFiltersChange, onClearFilters }: StudentFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.searchTerm) {
        onFiltersChange({ searchTerm: searchTerm.trim() || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.searchTerm, onFiltersChange]);

  const handleStatusChange = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status as StudentStatus)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status as StudentStatus];
    
    onFiltersChange({ 
      status: newStatuses.length > 0 ? newStatuses : undefined 
    });
  };



  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status?.length) count += filters.status.length;
    if (filters.joinDateRange) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar estudiantes por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros avanzados */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Estado */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Users className="mr-2 h-4 w-4" />
              Estado
              {filters.status?.length && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado del estudiante</Label>
              {(['ACTIVE', 'INACTIVE', 'SUSPENDED'] as StudentStatus[]).map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={() => handleStatusChange(status)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {status === 'ACTIVE' ? 'Activo' : 
                     status === 'INACTIVE' ? 'Inactivo' : 'Suspendido'}
                  </span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>



        {/* Limpiar filtros */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: "{filters.searchTerm}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ searchTerm: undefined })}
              />
            </Badge>
          )}
          
          {filters.status?.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {status === 'ACTIVE' ? 'Activo' : 
               status === 'INACTIVE' ? 'Inactivo' : 'Suspendido'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusChange(status)}
              />
            </Badge>
          ))}
          
          
        </div>
      )}
    </div>
  );
}
