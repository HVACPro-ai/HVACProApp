import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api'; // Replace with your backend URL

export interface ServiceCall {
  id: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  date: string;
  description: string;
}

export const registerUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { username, password });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const saveServiceCall = async (serviceCall: any) => {
  const response = await axios.post(`${API_URL}/serviceCalls`, serviceCall);
  return response.data;
};

export const fetchServiceCalls = async (): Promise<ServiceCall[]> => {
  // Mock data
  return [
    {
      id: '1',
      customerName: 'John Doe',
      address: '123 Main St',
      phoneNumber: '555-0123',
      date: new Date().toISOString(),
      description: 'AC not cooling',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      address: '456 Oak Ave',
      phoneNumber: '555-0124',
      date: new Date().toISOString(),
      description: 'Heating system maintenance',
    },
  ];
}; 