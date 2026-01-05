export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  date: string;
  subscriptionPlan: string;
  nextBillingDate?: string;
}

export interface BillingFilter {
  status?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BillingPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface MemberDetails {
  id: string;
  memberId: string;
  memberName: string;
  email: string;
  phone?: string;
  planName: string;
  planPrice: number;
  joinDate: string;
  lastPaymentDate: string;
  nextBillingDate: string;
  totalPayments: number;
  totalAmount: number;
  status: 'active' | 'overdue' | 'suspended' | 'cancelled';
  paymentHistory: Array<{
    id: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    paymentMethod: string;
    transactionId: string;
    date: string;
    subscriptionPlan: string;
  }>;
}

export interface BillingMetrics {
  monthlyIncome: {
    amount: number;
    change: number;
    trend: 'up' | 'down';
  };
  pendingPayments: {
    amount: number;
    change: number;
    trend: 'up' | 'down';
  };
  membersUpToDate: {
    count: number;
    change: number;
    trend: 'up' | 'down';
  };
  overduePayments: {
    count: number;
    change: number;
    trend: 'up' | 'down';
  };
}

export interface OverdueMember {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  planPrice: number;
  daysOverdue: number;
  lastPaymentDate: string;
  nextBillingDate: string;
  email: string;
  phone?: string;
}
