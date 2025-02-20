import { Activity } from '@/src/hooks/useDashboardData';

export const getRecentActivities = async (): Promise<Activity[]> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      type: 'service_call',
      description: 'AC repair completed at 123 Main St',
      timestamp: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      type: 'installation',
      description: 'New HVAC system installation scheduled',
      timestamp: new Date().toISOString(),
      status: 'scheduled',
    },
    // Add more mock activities as needed
  ] as Activity[];
}; 