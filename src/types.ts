export interface ServiceImage {
  uri: string;
  type?: string;
  name?: string;
}

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  loading?: boolean;
}

export type QuestionType = 'yes_no' | 'multiple_choice';

export interface AIQuestion {
  id: string;
  text: string;
  type: 'yes_no' | 'multiple_choice';
  options?: string[];
  nextQuestionMap: {
    [key: string]: string | null; // Maps answer to next question ID, null means end of questions
  };
}

export interface TestingInstruction {
  step: number;
  description: string;
  completed?: boolean;
  imageUrl?: string;
  warningNote?: string;
}

export interface InventoryStatus {
  partNumber: string;
  partName: string;
  availability: 'in_stock' | 'back_ordered' | 'discontinued';
  quantity?: number;
  location?: string;
  estimatedDelivery?: string;
  alternativeParts?: string[];
}

export interface SensorData {
  temperature: number;
  pressure: number;
  humidity: number;
  airflow: number;
  powerConsumption: number;
  noiseLevel?: number;
}

export interface SystemSettings {
  temperature: number;
  pressure: number;
  humidity: number;
  airflow: number;
  powerConsumption: number;
  fanSpeed: number;
  mode: 'heat' | 'cool' | 'auto';
  schedule: {
    [key: string]: {
      targetTemp: number;
      startTime: string;
      endTime: string;
    };
  };
}

export interface EquipmentTypeInfo {
  type: 'furnace' | 'ac' | 'minisplit';
  brand: string;
  series?: string;
}

export interface DiagnosticState {
  modelNumber: string;
  serialNumber: string;
  brand: string;
  symptoms: string[];
  images?: ServiceImage[];
  testingInstructions: TestingInstruction[];
  answers: {
    [key: string]: string;
  };
  sensorData?: {
    temperature: number;
    pressure: number;
    humidity: number;
    airflow: number;
    powerConsumption: number;
    noiseLevel?: number;
  };
  currentQuestion?: AIQuestion;
  confirmedIssue?: string;
  equipmentType?: EquipmentTypeInfo;
  inventoryStatus?: InventoryStatus;
}

export interface DiagnosticHistoryItem extends DiagnosticState {
  id: string;
  timestamp: number;
  confirmedIssue: string;
  resolution?: string;
}

export interface OrderDetails {
  quantity: number;
  priority: 'standard' | 'express' | 'urgent';
  notes: string;
} 