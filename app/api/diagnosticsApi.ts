import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api'; // Replace with your backend URL

export const fetchDiagnostics = async (modelNumber, serialNumber, symptoms) => {
  const response = await axios.post(`${API_URL}/diagnostics`, { modelNumber, serialNumber, symptoms });
  return response.data;
}; 