import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  RefreshCw,
  Download,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import type { BillingDetails } from "@/core/interfaces/billing.interface";

interface PaymentsTableProps {
  payments: BillingDetails;
  loading: boolean;
  selectedPayments: string[];
  onSelectAll: (checked: boolean) => void;
  onViewInvoice: (paymentId: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  onSort: (column: string) => void;
}

export function PaymentsTable({
  payments,
  loading,
  selectedPayments,
  onViewInvoice,
  onExport,
  onRefresh,
  onSort,
}: PaymentsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "outline";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      case "refunded":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={loading || selectedPayments.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" disabled={loading} onClick={onRefresh}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
            
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("payerEmail")}
              >
                <div className="flex items-center">
                  Miembro
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Método de Pago</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("amount")}
              >
                <div className="flex items-center">
                  Monto
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("dateApproved")}
              >
                <div className="flex items-center">
                  Fecha
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Próxima Facturación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Cargando pagos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No se encontraron pagos que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : (
              payments.content.map((payment) => (
                <TableRow key={payment.id} data-state={selectedPayments.includes(payment.id) && "selected"}>
                  <TableCell className="font-medium">
                    {payment.payerEmail}
                  </TableCell>
                  <TableCell>{payment.planName}</TableCell>
                  <TableCell className="capitalize">
                    {payment.paymentMethodId}
                  </TableCell>
                  <TableCell>S/.{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    {payment.planExpirationDate ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInvoice(payment.id)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Factura
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
