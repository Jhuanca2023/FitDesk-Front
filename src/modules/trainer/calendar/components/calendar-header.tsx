import { ChevronLeft, ChevronRight, Calendar, Grid3X3, List, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/core/lib/utils';
import type { CalendarView, CalendarFilters, ClassStatus } from '../types';
import { CLASS_STATUS_LABELS } from '../types';

interface CalendarHeaderProps {
  title: string;
  viewType: CalendarView['type'];
  filters: CalendarFilters;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onRefresh: () => void;
  onViewChange: (view: CalendarView['type']) => void;
  onFiltersChange: (filters: Partial<CalendarFilters>) => void;
  onClearFilters: () => void;
  availableLocations?: string[];
  isRefreshing?: boolean;
  className?: string;
}

export function CalendarHeader({
  title,
  viewType,
  filters,
  onPrevious,
  onNext,
  onToday,
  onRefresh,
  onViewChange,
  onFiltersChange,
  onClearFilters,
  availableLocations = [],
  isRefreshing = false,
  className
}: CalendarHeaderProps) {
  const hasActiveFilters = !!(filters.status || filters.location || filters.dateRange);

  return (
    <div className={cn("flex flex-col space-y-4 p-4 border-b bg-background", className)}>
      {/* Primera fila: Navegación y título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Navegación */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              className="ml-2"
            >
              Hoy
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="ml-2 h-8 w-8 p-0"
              title="Refrescar calendario"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>

          {/* Título */}
          <h2 className="text-xl font-semibold capitalize">{title}</h2>
        </div>

        {/* Selector de vista */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewType === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('week')}
              className="rounded-r-none border-r"
            >
              <List className="h-4 w-4 mr-1" />
              Semana
            </Button>
            <Button
              variant={viewType === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('month')}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Mes
            </Button>
          </div>
        </div>
      </div>

      {/* Segunda fila: Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Filtro por estado */}
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ 
                status: value === 'all' ? undefined : value as ClassStatus 
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.entries(CLASS_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por ubicación */}
          {availableLocations.length > 0 && (
            <Select
              value={filters.location || 'all'}
              onValueChange={(value) => 
                onFiltersChange({ 
                  location: value === 'all' ? undefined : value 
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                {availableLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Indicador de filtros activos */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Filtros activos
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs h-6 px-2"
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Vista {viewType === 'week' ? 'semanal' : 'mensual'}</span>
          </div>
        </div>
      </div>

      {/* Tercera fila: Filtros activos */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Filtros:</span>
          
          {filters.status && (
            <Badge variant="outline" className="text-xs">
              Estado: {CLASS_STATUS_LABELS[filters.status]}
            </Badge>
          )}
          
          {filters.location && (
            <Badge variant="outline" className="text-xs">
              Ubicación: {filters.location}
            </Badge>
          )}
          
          {filters.dateRange && (
            <Badge variant="outline" className="text-xs">
              Rango personalizado
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
