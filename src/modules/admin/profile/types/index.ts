export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  joinDate: string;
  address?: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon?: string;
  type: 'member' | 'payment' | 'class' | 'system';
  createdAt: string;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}
