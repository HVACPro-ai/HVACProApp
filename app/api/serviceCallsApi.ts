import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api'; // Replace with your backend URL

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

export const fetchServiceCalls = async () => {
  const response = await axios.get(`${API_URL}/serviceCalls`);
  return response.data;
}; 