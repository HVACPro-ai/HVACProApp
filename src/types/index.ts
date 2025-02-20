import { InventoryStatus } from '../constants/inventory';

// Equipment Types
export interface EquipmentTypeInfo {
  id: string;
  name: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

// Re-export the InventoryStatus to avoid type conflicts
export { InventoryStatus } from '../constants/inventory';

// Diagnostic Types
export interface SensorData {
  temperature: number;
  pressure: number;
  humidity: number;
  airflow: number;
  powerConsumption: number;
}

export interface DiagnosticContext {
  equipment: {
    type: string;
    brand: string;
    model: string;
    serial: string;
  };
  symptoms: string[];
  answers: Record<string, string>;
  sensorData?: Partial<SensorData>;
  images?: string[];
  commonPatterns?: {
    commonIssues: string[];
    likelyParts: string[];
    confidence: number;
  };
}

export interface DiagnosticData {
  modelNumber: string;
  serialNumber: string;
  brand: string;
  equipmentType: EquipmentTypeInfo;
  images: ServiceImage[];
  sensorData: SensorData;
  symptoms: string[];
  testingInstructions: TestingInstruction[];
  answers: Record<string, string>;
  currentQuestion?: AIQuestion;
  confirmedIssue?: string;
  resolution?: string;
  inventoryStatus?: InventoryStatus;
}

export interface DiagnosticHistoryItem extends DiagnosticData {
  id: string;
  timestamp: number;
}

// Analysis Types
export interface SensorAnalysis {
  anomalies: string[];
  recommendations: string[];
  efficiency: number;
  readings: {
    temperature: number | null;
    pressure: number | null;
    humidity: number | null;
    airflow: number | null;
  };
}

export interface ImageAnalysis {
  analysis: string;
  detectedIssues: string[];
  confidence: number;
  annotations?: {
    x: number;
    y: number;
    label: string;
  }[];
}

// Supporting Types
export interface TestingInstruction {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface RecommendedPart {
  partNumber: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  availability: boolean;
  price?: number;
  reason: string;
}

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
}

// Type Guards
export function isSensorAnalysis(obj: any): obj is SensorAnalysis {
  return (
    obj &&
    Array.isArray(obj.anomalies) &&
    Array.isArray(obj.recommendations) &&
    typeof obj.efficiency === 'number' &&
    obj.readings &&
    typeof obj.readings === 'object'
  );
}

export function isImageAnalysis(obj: any): obj is ImageAnalysis {
  return (
    obj &&
    typeof obj.analysis === 'string' &&
    Array.isArray(obj.detectedIssues) &&
    typeof obj.confidence === 'number'
  );
}

export function isDiagnosticContext(obj: any): obj is DiagnosticContext {
  return (
    obj &&
    obj.equipment &&
    typeof obj.equipment === 'object' &&
    Array.isArray(obj.symptoms) &&
    typeof obj.answers === 'object'
  );
}

// Add or update these types
export interface ServiceImage {
  uri: string;
  type: string;
  name: string;
}

export interface ImageAnalysisResult {
  findings: string[];
  confidence: number;
  detectedIssues: string[];
}

export interface SystemSettings {
  temperature: number;
  pressure: number;
  humidity: number;
  airflow: number;
  powerConsumption: number;
  fanSpeed: number;
  mode: 'auto' | 'heat' | 'cool' | 'fan';
  schedule: {
    [key: string]: {
      targetTemp: number;
      startTime: string;
      endTime: string;
    };
  };
} 