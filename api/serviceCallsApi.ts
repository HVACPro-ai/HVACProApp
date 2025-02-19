// Types for service calls
export interface ServiceCall {
  id: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  description: string;
  date: Date;
}

// Function to fetch service calls
export const fetchServiceCalls = async (): Promise<ServiceCall[]> => {
  try {
    // Here you would typically make an API call to your backend
    // For now, return mock data
    return [
      {
        id: '1',
        customerName: 'John Doe',
        address: '123 Main St',
        phoneNumber: '555-0123',
        description: 'AC not cooling',
        date: new Date()
      }
    ];
  } catch (error) {
    console.error('Error fetching service calls:', error);
    throw error;
  }
};

// Function to add a new service call
export const addServiceCall = async (serviceCall: Omit<ServiceCall, 'id'>): Promise<ServiceCall> => {
  try {
    // Here you would typically make an API call to your backend
    // For now, return mock data with a random ID
    return {
      id: Math.random().toString(),
      ...serviceCall
    };
  } catch (error) {
    console.error('Error adding service call:', error);
    throw error;
  }
}; 