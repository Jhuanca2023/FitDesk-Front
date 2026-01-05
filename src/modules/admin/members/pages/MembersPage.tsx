import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Download, RefreshCw, ChevronDown, SearchIcon, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/components/ui/toast';
import { MembersTable } from '../components/MembersTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/shared/components/ui/dialog';
import { useAllMembersQuery } from '@/core/queries/useMemberQuery';
import type { MEMBER_STATUS, MemberFilters } from '@/core/interfaces/member.interface';
import { useDebounce } from '@/core/hooks/useDebounce';


export function MembersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());


  const [searchTerm, setSearchTerm] = useState('');
  const [membershipStatus, setMembershipStatus] = useState<string>('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  const debouncedSearch = useDebounce(searchTerm, 500);

  const filters: MemberFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    membershipStatus: membershipStatus as MEMBER_STATUS || undefined,
    page,
    size,
    sortField,
    sortDirection,
  }), [debouncedSearch, membershipStatus, page, size, sortField, sortDirection]);


  const { data, isLoading, isError, error, refetch } = useAllMembersQuery(filters);
  console.log('MembersPage render', { filters, data });
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleMembershipStatusChange = (value: string) => {
    setMembershipStatus(value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMembershipStatus('');
    setPage(0);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: 'Exportando...',
      description: `Generando archivo ${format.toUpperCase()}`,
    });

  };


  const activeFiltersCount = [searchTerm, membershipStatus].filter(Boolean).length;

  return (
    <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Miembros</h1>
          <p className="text-muted-foreground">
            Administra los miembros de tu gimnasio y sus membresías
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => refetch()}
            title="Actualizar lista de miembros"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exportar
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => navigate('/admin/members/nuevo')} size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Miembro
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, email o DNI..."
              className="pl-9 w-full bg-background"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={membershipStatus} onValueChange={handleMembershipStatusChange}>
              <SelectTrigger className="bg-background w-full sm:w-48">
                <SelectValue placeholder="Estado de membresía" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activa</SelectItem>
                <SelectItem value="EXPIRED">Vencida</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="SUSPENDED">Suspendida</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="shrink-0"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-semibold">Lista de Miembros</h2>
            {data && (
              <p className="text-sm text-muted-foreground">
                Mostrando {data.members.length} de {data.totalElements} miembros
              </p>
            )}
          </div>
        </div>

        {isError ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error al cargar los miembros</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <MembersTable
              members={data?.members || []}
              isLoading={isLoading}
              selectedRows={selectedMembers}
              onSelectionChange={setSelectedMembers}
              onView={(member) => navigate(`/admin/members/${member.userId}`)}

            />

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Página {page + 1} de {data.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                    disabled={page >= data.totalPages - 1 || data.last}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>


    </div>
  );
}