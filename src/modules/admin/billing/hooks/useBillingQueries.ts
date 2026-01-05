import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '../service/billing.service';
import type { BillingFilter } from '../types/billing.types';
import { useToast } from '@/shared/components/ui/toast';


export const billingKeys = {
  all: ['billing'] as const,
  payments: () => [...billingKeys.all, 'payments'] as const,
  paymentsWithFilters: (filters: BillingFilter & { page?: number }) => 
    [...billingKeys.payments(), filters] as const,
  metrics: () => [...billingKeys.all, 'metrics'] as const,
  overdueMembers: () => [...billingKeys.all, 'overdue-members'] as const,
  memberDetails: (memberId: string) => [...billingKeys.all, 'member-details', memberId] as const,
};


export function usePayments(params: BillingFilter & { page?: number } = {}) {
  return useQuery({
    queryKey: billingKeys.paymentsWithFilters(params),
    queryFn: () => billingService.getPayments(params),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
}


export function useBillingMetrics() {
  return useQuery({
    queryKey: billingKeys.metrics(),
    queryFn: () => billingService.getBillingMetrics(),
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
  });
}


export function useOverdueMembers() {
  return useQuery({
    queryKey: billingKeys.overdueMembers(),
    queryFn: () => billingService.getOverdueMembers(),
    staleTime: 1 * 60 * 1000, 
    gcTime: 3 * 60 * 1000, 
  });
}


export function useMemberDetails(memberId: string | null) {
  return useQuery({
    queryKey: billingKeys.memberDetails(memberId!),
    queryFn: () => billingService.getMemberDetails(memberId!),
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
}


export function useForceRenewal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (paymentId: string) => billingService.forceRenewal(paymentId),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
      queryClient.invalidateQueries({ queryKey: billingKeys.metrics() });
      
      toast({
        type: 'success',
        title: 'Éxito',
        description: 'La renovación se ha forzado exitosamente.',
      });
    },
    onError: (error: Error) => {
      toast({
        type: 'destructive',
        title: 'Error',
        description: error.message || 'Error al forzar la renovación. Por favor, inténtalo de nuevo.',
      });
    },
  });
}


export function useProcessRefund() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ paymentId, amount }: { paymentId: string; amount?: number }) => 
      billingService.processRefund(paymentId, amount),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
      queryClient.invalidateQueries({ queryKey: billingKeys.metrics() });
      
      toast({
        title: 'Reembolso exitoso',
        description: 'El reembolso se ha procesado correctamente.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `No se pudo procesar el reembolso: ${error.message}`,
        type: 'destructive',
      });
    },
  });
}


export function useExportPayments() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => billingService.exportPayments(),
    onSuccess: () => {
      toast({
        title: 'Exportación exitosa',
        description: 'Los pagos se han exportado correctamente.',
      });
    },
    onError: (_error: Error) => {
      toast({
        title: 'Error',
        description: 'No se pudo exportar los pagos',
        type: 'destructive',
      });
    },
  });
}


export function useSendPaymentReminder() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (memberId: string) => billingService.sendPaymentReminder(memberId),
    onSuccess: () => {
      toast({
        title: 'Recordatorio Enviado',
        description: 'Se ha enviado un recordatorio de pago al miembro exitosamente.',
        type: 'default',
      });
    },
    onError: (_error: Error) => {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el recordatorio. Por favor, intente nuevamente.',
        type: 'destructive',
      });
    },
  });
}


export function useSendBulkReminders() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (memberIds: string[]) => billingService.sendBulkReminders(memberIds),
    onSuccess: (_, memberIds) => {
      toast({
        title: 'Recordatorios Enviados',
        description: `Se han enviado ${memberIds.length} recordatorios de pago exitosamente.`,
        type: 'default',
      });
    },
    onError: (_error: Error) => {
      toast({
        title: 'Error',
        description: 'No se pudieron enviar los recordatorios. Por favor, intente nuevamente.',
        type: 'destructive',
      });
    },
  });
}


export function useGetInvoice() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (paymentId: string) => billingService.getInvoice(paymentId),
    onSuccess: (invoiceBlob, paymentId) => {
      const url = window.URL.createObjectURL(invoiceBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Factura Descargada',
        description: 'La factura se ha descargado exitosamente.',
      });
    },
    onError: (_error: Error) => {
      toast({
        title: 'Error',
        description: 'No se pudo generar la factura. Por favor, intente nuevamente.',
        type: 'destructive',
      });
    },
  });
}
