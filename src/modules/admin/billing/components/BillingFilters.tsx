import { Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { useBillingStore } from '../store/billing.store';

const statusOptions = [
  { value: 'all', label: 'Todos los Estados' },
  { value: 'completed', label: 'Completado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'failed', label: 'Fallido' },
  { value: 'refunded', label: 'Reembolsado' },
];

const paymentMethodOptions = [
  { value: 'all', label: 'Todos los Métodos' },
  { value: 'credit_card', label: 'Tarjeta de Crédito' },
  { value: 'debit_card', label: 'Tarjeta de Débito' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'paypal', label: 'PayPal' },
];

export function BillingFilters() {
  const { filters, setFilters, fetchPayments } = useBillingStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-4 shadow-sm">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium text-foreground/80">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre del miembro, email o ID de transacción"
              className="pl-9 bg-background/80 hover:bg-background transition-colors"
              value={filters.searchTerm || ''}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-foreground/80">
            Estado
          </label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
          >
            <SelectTrigger id="status-filter" className="bg-background/80 hover:bg-background transition-colors">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="payment-method-filter" className="text-sm font-medium text-foreground/80">
            Método de Pago
          </label>
          <Select
            value={filters.paymentMethod || 'all'}
            onValueChange={(value) => setFilters({ ...filters, paymentMethod: value === 'all' ? undefined : value })}
          >
            <SelectTrigger id="payment-method-filter" className="bg-background/80 hover:bg-background transition-colors">
              <SelectValue placeholder="Todos los Métodos" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="from-date" className="text-sm font-medium text-foreground/80">
            Fecha Desde
          </label>
          <div className="relative">
            <DatePicker
              id="from-date"
              selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
              onChange={(date: Date | undefined) =>
                setFilters({ ...filters, dateFrom: date ? date.toISOString().split('T')[0] : undefined })
              }
              className="w-full bg-background/80 hover:bg-background transition-colors"
              placeholderText="Fecha desde"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="to-date" className="text-sm font-medium text-foreground/80">
            Fecha Hasta
          </label>
          <div className="relative">
            <DatePicker
              id="to-date"
              selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
              onChange={(date: Date | undefined) =>
                setFilters({ ...filters, dateTo: date ? date.toISOString().split('T')[0] : undefined })
              }
              className="w-full bg-background/80 hover:bg-background transition-colors"
              placeholderText="Fecha hasta"
            />
          </div>
        </div>

        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
          <Button 
            type="submit" 
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <Search className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
}
