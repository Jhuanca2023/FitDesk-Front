export type UserRole = 'ADMIN' | 'TRAINER' | 'USER';



export interface UserWithRole {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
  joinDate: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

