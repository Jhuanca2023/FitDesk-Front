import { useState } from 'react';
import {
  usePayments,

  useOverdueMembers,
  useForceRenewal,
  useProcessRefund,
  useExportPayments,
  useSendPaymentReminder,
  useSendBulkReminders,
  useGetInvoice,
  useMemberDetails,
  useBillingMetrics
} from './useBillingQueries';
import type { BillingFilter, MemberDetails } from '../types/billing.types';

export function useBillingPageQuery() {

  const [selectedMember, setSelectedMember] = useState<MemberDetails | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [filters, setFilters] = useState<BillingFilter & { page?: number }>({ page: 1 });


  const paymentsQuery = usePayments(filters);
  const metricsQuery = useBillingMetrics();
  const overdueQuery = useOverdueMembers();
  const memberDetailsQuery = useMemberDetails(selectedMember?.id || null);
  const forceRenewalMutation = useForceRenewal();
  const processRefundMutation = useProcessRefund();
  const exportPaymentsMutation = useExportPayments();
  const sendReminderMutation = useSendPaymentReminder();
  const sendBulkRemindersMutation = useSendBulkReminders();
  const getInvoiceMutation = useGetInvoice();

  const loading = paymentsQuery.isLoading || metricsQuery.isLoading || overdueQuery.isLoading;
  const error = paymentsQuery.error || metricsQuery.error || overdueQuery.error;
  const payments = paymentsQuery.data?.payments || [];
  const pagination = paymentsQuery.data?.pagination || {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  };

  const overdueMembers = overdueQuery.data || [];
  const memberLoading = memberDetailsQuery.isLoading;


  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };





  const handleExport = async () => {
    await exportPaymentsMutation.mutateAsync();
  };

  const handleViewInvoice = async (paymentId: string) => {
    await getInvoiceMutation.mutateAsync(paymentId);
  };



  const openMemberModal = (memberId: string) => {
    const member = overdueMembers.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member as any);
      setIsMemberModalOpen(true);
    }
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
  };

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev => {
      const index = prev.indexOf(paymentId);
      if (index > -1) {
        return prev.filter(id => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
  };

  const selectAllPayments = (select: boolean) => {
    setSelectedPayments(select ? payments.map(p => p.id) : []);
  };

  const isProcessing =
    forceRenewalMutation.isPending ||
    processRefundMutation.isPending ||
    exportPaymentsMutation.isPending ||
    sendReminderMutation.isPending ||
    sendBulkRemindersMutation.isPending ||
    getInvoiceMutation.isPending;

  return {
    payments,
    loading,
    error: error?.message || null,
    pagination,
    selectedPayments,
    overdueMembers,


    selectedMember,
    isMemberModalOpen,
    memberLoading,


    isProcessing,

    togglePaymentSelection,
    selectAllPayments,
    handlePageChange,
    handleExport,
    handleViewInvoice,

    openMemberModal,
    closeMemberModal,
  };
}
