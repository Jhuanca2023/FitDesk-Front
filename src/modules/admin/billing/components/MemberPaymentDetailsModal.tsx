import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MemberDetails } from '../types/billing.types';

interface MemberPaymentDetailsModalProps {
  member: MemberDetails | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export function MemberPaymentDetailsModal({ 
  member, 
  isOpen, 
  onClose, 
  loading = false 
}: MemberPaymentDetailsModalProps) {
  if (!member) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cargando detalles del miembro...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-6 gap-6" style={{ width: '95vw', maxWidth: 'none' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-blue-500">
              <AvatarFallback className="text-white font-semibold">
                {getInitials(member.memberName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{member.memberName}</h2>
              <p className="text-sm text-muted-foreground">ID: {member.memberId}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden space-y-6 -mx-2 px-2">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">
                    Miembro desde {format(new Date(member.joinDate), 'MMM yyyy', { locale: es })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Plan Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-semibold text-lg text-green-600">{member.planName}</p>
                  <p className="text-2xl font-bold">${member.planPrice}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={getMemberStatusColor(member.status)}
                >
                  {member.status === 'active' ? 'Activo' : 
                   member.status === 'overdue' ? 'Vencido' :
                   member.status === 'suspended' ? 'Suspendido' : 'Cancelado'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Pagos:</span>
                  <span className="font-semibold">{member.totalPayments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Pagado:</span>
                  <span className="font-semibold">${member.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Último Pago:</span>
                  <span className="text-sm">
                    {format(new Date(member.lastPaymentDate), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Próximo Pago:</span>
                  <span className="text-sm">
                    {format(new Date(member.nextBillingDate), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial de Pagos */}
          <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-sm -mx-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  Historial de Pagos
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Exportar todo
                    </span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">ID de Transacción</TableHead>
                      <TableHead className="w-[120px]">Fecha</TableHead>
                      <TableHead className="w-[100px] text-right">Monto</TableHead>
                      <TableHead className="w-[120px]">Método</TableHead>
                      <TableHead className="w-[120px]">Estado</TableHead>
                      <TableHead className="w-[100px] text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.paymentHistory.map((payment: { id: string; transactionId: string; date: string; amount: number; paymentMethod: string; status: string }) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{payment.transactionId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{format(new Date(payment.date), 'dd/MM/yyyy', { locale: es })}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(payment.date), 'HH:mm', { locale: es })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="capitalize">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {payment.paymentMethod.replace('_', ' ')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(payment.status)} border flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(payment.status)}
                            <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Aquí iría la lógica para descargar la factura
                                    console.log('Descargando factura:', payment.transactionId);
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Descargar factura</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Descargar factura</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
