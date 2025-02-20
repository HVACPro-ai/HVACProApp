// Equipment Types
export interface EquipmentTypeInfo {
  type: 'furnace' | 'ac' | 'minisplit';
  brand: string;
  series?: string;
}

// Diagnostic Types
export interface SensorData {
  temperature: number;
  pressure: number;
  humidity: number;
  airflow: number;
  powerConsumption: number;
  noiseLevel?: number;
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

export interface DiagnosticState {
  equipmentType?: EquipmentTypeInfo;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  symptoms: string[];
  answers: Record<string, string>;
  sensorData?: Partial<SensorData>;
  confirmedIssue?: string;
}

// Analysis Types
export interface AIAnalysisResult {
  issue: string;
  confidence: number;
  explanation: string;
  testingInstructions: TestingInstruction[];
  recommendedParts: RecommendedPart[];
  safetyNotes: string[];
  additionalRecommendations: string[];
}

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
  step: number;
  description: string;
  warningNote?: string;
  completed: boolean;
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
  type: 'yes_no' | 'multiple_choice' | 'text';
  options: string[];
  nextQuestionMap: Record<string, string>;
}

// Type Guards
export function isAIAnalysisResult(obj: any): obj is AIAnalysisResult {
  return (
    obj &&
    typeof obj.issue === 'string' &&
    typeof obj.confidence === 'number' &&
    typeof obj.explanation === 'string' &&
    Array.isArray(obj.testingInstructions) &&
    Array.isArray(obj.recommendedParts) &&
    Array.isArray(obj.safetyNotes) &&
    Array.isArray(obj.additionalRecommendations)
  );
}

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