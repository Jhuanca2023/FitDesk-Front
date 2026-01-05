import { useState, useMemo } from "react";
import { PaymentsTable } from "../components/PaymentsTable";
import { Button } from "@/shared/components/ui/button";
import { useBillingDetails } from "@/core/queries/useBillingQuery";
import type { BillingDetails, BillingDetailsParams } from "@/core/interfaces/billing.interface";

const EMPTY_BILLING_DETAILS: BillingDetails = {
  content: [],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: { sorted: false, unsorted: true, empty: true },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  totalPages: 0,
  totalElements: 0,
  last: true,
  first: true,
  size: 10,
  number: 0,
  sort: { sorted: false, unsorted: true, empty: true },
  numberOfElements: 0,
  empty: true,
};

export default function BillingPage() {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const [filters, setFilters] = useState<Omit<BillingDetailsParams, 'page' | 'size' | 'sort'>>({});
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [sort, setSort] = useState({ sort: 'dateApproved,desc' });

  const queryParams = useMemo(() => ({
    ...filters,
    page: pagination.page,
    size: pagination.size,
    ...sort,
  }), [filters, pagination, sort]);

  const { data: payments = EMPTY_BILLING_DETAILS, isLoading, isFetching, refetch } = useBillingDetails(queryParams);


  const handleSort = (column: string) => {
    setSort(prevSort => {
      const [currentCol, currentDir] = prevSort.sort.split(',');
      if (currentCol === column) {
        return { sort: `${column},${currentDir === 'asc' ? 'desc' : 'asc'}` };
      }
      return { sort: `${column},desc` };
    });
  };

  const handlePageChange = (newPage: number) => {
    setPagination(p => ({ ...p, page: newPage }));
  };

  const selectAllPayments = (checked: boolean) => {
    if (checked) {
      // // const allPaymentIds = payments.payments.map((p) => p.id);
      // setSelectedPayments(allPaymentIds);
    } else {
      setSelectedPayments([]);
    }
  };

  const handleViewInvoice = (paymentId: string) => {
    console.log("View invoice for:", paymentId);
  };
  
  const handleExport = () => {
    console.log("Exporting:", selectedPayments);
  };


  const loading = isLoading || isFetching;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Facturación
          </h1>
          <p className="text-muted-foreground">
            Ver y gestionar pagos, renovaciones y reembolsos de miembros
          </p>
        </div>
      </div>

      {/*<BillingFilters onFiltersChange={setFilters} />*/}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <PaymentsTable
          payments={payments}
          loading={loading}
          selectedPayments={selectedPayments}
          onSelectAll={selectAllPayments}
          onViewInvoice={handleViewInvoice}
          onExport={handleExport}
          onRefresh={() => refetch()}
          onSort={handleSort}
        />

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Página{" "}
            <span className="font-medium">{payments.pageable.pageNumber + 1}</span> de{" "}
            <span className="font-medium">{payments.totalPages}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(payments.pageable.pageNumber - 1)}
              disabled={payments.first || loading}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(payments.pageable.pageNumber + 1)}
              disabled={payments.last || loading}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
}
