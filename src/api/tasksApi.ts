export const getTodaysTasks = async () => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      title: 'AC Repair - Smith Residence',
      priority: 'high',
      dueTime: '14:00',
      status: 'pending',
      type: 'service_call',
    },
    {
      id: '2',
      title: 'HVAC Installation - Johnson Building',
      priority: 'medium',
      dueTime: '16:30',
      status: 'in_progress',
      type: 'installation',
    },
    // Add more mock tasks as needed
  ];
}; 