export const getDashboardStats = async () => {
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
      label: 'Revenue',
      value: 2450,
      change: 15,
      trend: 'up' as const,
    },
    {
      label: 'Pending',
      value: 5,
      change: 0,
      trend: 'neutral' as const,
    },
  ];
}; 