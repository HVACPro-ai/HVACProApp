import { Task } from '@/src/types/Task';

export interface TaskDetails extends Task {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  equipment: {
    type: string;
    model: string;
    serialNumber: string;
    lastService: string;
  };
  notes: string;
  images: ServiceImage[];
  status: Task['status'];
}

export interface ServiceImage {
  id: string;
  url: string;
  type: 'before' | 'after' | 'issue' | 'parts';
  caption?: string;
  timestamp: string;
}

export interface ServiceHistory {
  id: string;
  date: string;
  type: 'service_call' | 'installation' | 'maintenance' | 'quote';
  technician: string;
  description: string;
  cost: number;
  partsReplaced?: string[];
  images: ServiceImage[];
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'AC Maintenance',
    description: 'Annual maintenance check',
    dueDate: '2024-03-15',
    dueTime: '09:00',
    priority: 'high',
    status: 'pending',
    customerId: 'cust123',
    equipmentId: 'equip456'
  },
  {
    id: '2',
    title: 'Heat Pump Installation',
    description: 'New installation',
    dueDate: '2024-03-15',
    dueTime: '14:00',
    priority: 'medium',
    status: 'in_progress',
    customerId: 'cust789',
    equipmentId: 'equip012'
  }
];

const MOCK_TASK_DETAILS: TaskDetails[] = [
  {
    id: '1',
    title: 'AC Maintenance',
    description: 'Annual maintenance check',
    dueDate: '2024-03-15',
    dueTime: '09:00',
    priority: 'high',
    status: 'pending',
    customerId: 'cust123',
    equipmentId: 'equip456',
    customer: {
      name: 'John Smith',
      phone: '555-0123',
      email: 'john@example.com',
      address: '123 Main St'
    },
    equipment: {
      type: 'Air Conditioner',
      model: 'CoolMax 3000',
      serialNumber: 'CM3K-123456',
      lastService: '2023-09-15'
    },
    notes: 'Customer reported unusual noise',
    images: []
  }
];

export const getTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_TASKS;
};

export const getTaskDetails = async (taskId: string): Promise<TaskDetails> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const task = MOCK_TASK_DETAILS.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};

export const getTodaysTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const today = new Date().toISOString().split('T')[0];
  return MOCK_TASKS.filter(task => task.dueDate === today);
};

export const updateTaskStatus = async (
  taskId: string,
  status: Task['status']
): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const task = MOCK_TASKS.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  return {
    ...task,
    status
  };
};

export const getServiceHistory = async (customerId: string): Promise<ServiceHistory[]> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      id: '1',
      date: '2024-02-15',
      type: 'maintenance',
      technician: 'Mike Johnson',
      description: 'Annual maintenance check. Cleaned coils, replaced filter, checked refrigerant levels.',
      cost: 149.99,
      partsReplaced: ['Air filter', 'Capacitor'],
      images: [
        {
          id: '1a',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/dirty-coils.jpg',
          type: 'before',
          caption: 'Dirty condenser coils',
          timestamp: '2024-02-15T10:30:00Z'
        },
        {
          id: '1b',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/clean-coils.jpg',
          type: 'after',
          caption: 'Cleaned condenser coils',
          timestamp: '2024-02-15T11:15:00Z'
        }
      ]
    },
    {
      id: '2',
      date: '2023-08-22',
      type: 'service_call',
      technician: 'Sarah Williams',
      description: 'Emergency call - No cooling. Found failed capacitor, replaced and restored operation.',
      cost: 285.00,
      partsReplaced: ['Dual Run Capacitor 45/5 MFD'],
      images: [
        {
          id: '2a',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/bad-capacitor.jpg',
          type: 'issue',
          caption: 'Failed dual run capacitor',
          timestamp: '2023-08-22T14:20:00Z'
        },
        {
          id: '2b',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/new-capacitor.jpg',
          type: 'parts',
          caption: 'New capacitor installed',
          timestamp: '2023-08-22T15:00:00Z'
        }
      ]
    },
    {
      id: '3',
      date: '2023-05-10',
      type: 'maintenance',
      technician: 'Mike Johnson',
      description: 'Spring maintenance check. System operating within specifications.',
      cost: 149.99,
      partsReplaced: ['Air filter'],
      images: [
        {
          id: '3a',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/maintenance-check.jpg',
          type: 'issue',
          caption: 'Annual maintenance inspection',
          timestamp: '2023-05-10T09:30:00Z'
        }
      ]
    },
    {
      id: '4',
      date: '2022-07-15',
      type: 'service_call',
      technician: 'Tom Wilson',
      description: 'Low refrigerant charge found. Located and repaired leak, recharged system.',
      cost: 425.00,
      partsReplaced: ['Schrader valve', 'R410A refrigerant'],
      images: [
        {
          id: '4a',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/refrigerant-leak.jpg',
          type: 'issue',
          caption: 'Leak detected at Schrader valve',
          timestamp: '2022-07-15T13:45:00Z'
        },
        {
          id: '4b',
          url: 'https://raw.githubusercontent.com/cbollin/hvac-images/main/pressure-test.jpg',
          type: 'after',
          caption: 'Pressure test after repair',
          timestamp: '2022-07-15T14:30:00Z'
        }
      ]
    }
  ];
}; 