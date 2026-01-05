export interface MemberResponse {
  userId: string;
  firstName: string;
  lastName: string | null;
  dni: string | null;
  phone: string | null;
  email: string | null;
  profileImageUrl: string | null;
  status: string | null;
}

export interface MemberRequest {
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
}

export interface UpdateMemberPayload {
  memberData: MemberRequest;
  profileImage?: File | null;
}

export interface Membership {
  planName: string;
  status: MEMBER_STATUS;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  isActive: boolean;
  isExpired: boolean;
}

export interface Member {
  userId: string;
  firstName: string;
  lastName: string | null;
  initials: string;
  dni: string | null;
  phone: string | null;
  email?: string;
  profileImageUrl: string | null;
  status: string | null;
  membership: Membership | null;
}

export interface MemberPageResponse {
  members: Member[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface MemberFilters {
  search?: string;
  dni?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  membershipStatus?: MEMBER_STATUS;
  page?: number;
  size?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export type MEMBER_STATUS =
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "SUSPENDED"
  | "PENDING";

export interface MemberSecurityData {
  userId: string;
  firstName: string;
  lastName: null;
  dni: null;
  phone: null;
  profileImageUrl: string;
  status: string;
  email: string;
  provider: string;
  membership: Membership | null;
}
export interface MemberWithRoles extends Member {
  roles?: Array<{
    name: string;
    description?: string;
  }>;
  lastLogin?: string;
}
