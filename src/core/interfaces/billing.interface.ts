export interface BillingStatistics {
  monthlyRevenue: MonthlyRevenue;
  newMembers: MonthlyRevenue;
  totalApprovedPayments: number;
  topPlans: TopPlan[];
  paymentStatusDistribution: PaymentStatusDistribution[];
}

export interface MonthlyRevenue {
  currenValue: number;
  percentageChange: number;
  trend: string;
}

export interface PaymentStatusDistribution {
  status: string;
  total: number;
}

export interface TopPlan {
  planName: string;
  total: number;
}

export interface BillingDetails {
  content: Content[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface BillingDetailsParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
  paymentMethodId?: string;
  startDate?: string;
  endDate?: string;
}

export interface Content {
  id: string;
  payerEmail: string;
  paymentMethodId: string;
  planName: string;
  amount: number;
  planExpirationDate: string;
  paymentDate: string;
  status: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
