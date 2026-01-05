export interface PlanResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  currency: string;
  isActive: boolean;
  isPopular: boolean;
  planImageUrl?: string;
  features: string[];
}

export interface CreatePlanRequest {
  name?: string;
  description?: string;
  price?: number;
  durationMonths?: number;
  currency?: string;
  isActive?: boolean;
  isPopular?: boolean;
  features?: string[];
}

export interface UpdatePlanRequest extends CreatePlanRequest {}




export interface Membership {
  id: string;
  userId: string;
  paymentId: string;
  planId: string;
  planName: string;
  durationMonths: number;
  amountPaid: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED" | "PENDING";
  externalReference: string;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
}
export interface UserMemberships {
    activeMembership: Membership | null;
    membershipHistory: Membership[];
    hasActiveMembership: boolean;
    totalMemberships: number;
  }