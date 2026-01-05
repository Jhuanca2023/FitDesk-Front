import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { BillingFilter, Payment, BillingMetrics, OverdueMember } from '../types/billing.types';

interface GetPaymentsParams extends BillingFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const billingService = {
  async getPayments(params: GetPaymentsParams = {}) {
    const { page = 1, ...filters } = params;
    
    const response = await fitdeskApi.get<{
      data: Payment[];
      pagination?: {
        page: number;
        pageSize: number;
        total: number;
      };
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    }>('/payments', {
      params: {
        page,
        pageSize: 10,
        ...filters,
      },
    });
    
    const responseData = response.data;
    const payments = Array.isArray(responseData.data) ? responseData.data : [];
    
    const paginationData = responseData.pagination || {
      page: responseData.page || page,
      pageSize: responseData.limit || 10,
      total: responseData.total || payments.length,
    };
    
    return {
      payments,
      pagination: {
        page: paginationData.page,
        pageSize: paginationData.pageSize,
        totalItems: paginationData.total,
        totalPages: responseData.totalPages || Math.ceil((paginationData.total || 0) / (paginationData.pageSize || 10)),
      }
    };
  },

  async getBillingMetrics(): Promise<BillingMetrics> {
    const response = await fitdeskApi.get('/admin/billing/metrics');
    return response.data;
  },

  async getOverdueMembers(): Promise<OverdueMember[]> {
    const response = await fitdeskApi.get('/admin/billing/overdue-members');
    return Array.isArray(response.data) ? response.data : [];
  },

  async forceRenewal(paymentId: string) {
    const response = await fitdeskApi.post(`/payments/${paymentId}/renew`);
    return response.data;
  },

  async processRefund(paymentId: string, amount?: number) {
    const response = await fitdeskApi.post(`/payments/${paymentId}/refund`, { amount });
    return response.data;
  },

  async exportPayments(): Promise<void> {
    const response = await fitdeskApi.get('/payments/export', {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    }
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async getMemberDetails(memberId: string) {
    const response = await fitdeskApi.get(`/admin/members/${memberId}/billing-details`);
    return response.data;
  },

  async getInvoice(paymentId: string): Promise<Blob> {
    const response = await fitdeskApi.get<Blob>(`/admin/payments/${paymentId}/invoice`, {
      responseType: 'blob',
    } as any);
    return response.data;
  },

  async sendPaymentReminder(memberId: string) {
    const response = await fitdeskApi.post(`/admin/members/${memberId}/payment-reminder`, {});
    return response.data;
  },

  async sendBulkReminders(memberIds: string[]) {
    const response = await fitdeskApi.post('/admin/members/bulk-payment-reminders', { memberIds });
    return response.data;
  },
};
