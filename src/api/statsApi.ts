import { DashboardStat } from '@/src/hooks/useDashboardData';

export const getDashboardStats = async (): Promise<DashboardStat[]> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      label: 'Open Calls',
      value: 12,
      change: 2,
      trend: 'up' as const,
    },
    {
      label: 'Completed Today',
      value: 8,
      change: -1,
      trend: 'down' as const,
    },
    {
      label: 'Parts Orders',
      value: 5,
      change: 1,
      trend: 'up' as const,
    },
    {
      label: 'Scheduled',
      value: 15,
      change: 3,
      trend: 'up' as const,
    },
  ];
}; 