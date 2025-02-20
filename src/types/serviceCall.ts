export interface ServiceCallWithStatus {
  id: string;
  customerName: string;
  date: string;
  address: string;
  description: string;
  phoneNumber: string;
  status: 'pending' | 'in-progress' | 'completed';
} 