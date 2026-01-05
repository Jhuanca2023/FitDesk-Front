
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MembershipStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
export type MembershipType = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'PREMIUM' | 'OTHER';
export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';


export interface Address {
  street: string;
  city: string;
  district: string;
  reference?: string;
}


export interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}


export interface Membership {
  type: MembershipType;
  startDate: string; 
  endDate: string;  
  status: MembershipStatus;
}


export interface Member {
  id: string;
 
  firstName: string;
  lastName: string;
  documentNumber?: string;
  birthDate: string; 
  gender: Gender;
  profileImage?: string;
  
  
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  
  
  membership: Membership;
  
 
  status: MemberStatus;
  registrationDate: string; 
  lastUpdated: string;      
  
  
  notes?: string;
}


export interface CreateMemberDTO extends Omit<Member, 'id' | 'registrationDate' | 'lastUpdated' | 'status'> {}
export interface UpdateMemberDTO extends Partial<CreateMemberDTO> {}


export interface MemberFilters {
  status?: MemberStatus[];
  membershipStatus?: MembershipStatus[];
  membershipType?: MembershipType[];
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}


export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
