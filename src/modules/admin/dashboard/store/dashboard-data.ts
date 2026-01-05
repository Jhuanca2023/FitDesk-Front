import { Activity, DollarSign, Eye, Users } from 'lucide-react';
import type { DashboardStat } from '../types';


export const dashboardStats: DashboardStat[] = [
  {
    title: 'Total Users',
    value: '12,345',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Active Sessions',
    value: '2,456',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Activity,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  }
];
