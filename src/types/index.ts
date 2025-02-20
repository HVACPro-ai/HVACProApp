// All types in one file for now
export interface EquipmentTypeInfo {
  type: 'furnace' | 'ac' | 'minisplit';
  brand: string;
  series?: string;
}

export interface DiagnosticState {
  equipmentType?: EquipmentTypeInfo;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  symptoms: string[];
  answers: Record<string, string>;
  sensorData?: {
    temperature?: number;
    pressure?: number;
    humidity?: number;
    airflow?: number;
    powerConsumption?: number;
    noiseLevel?: number;
  };
  confirmedIssue?: string;
}

export interface AIQuestion {
  id: string;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'text';
  options: string[];
  nextQuestionMap: Record<string, string>;
}

export interface AIAnalysisResult {
  issue: string;
  confidence: number;
  explanation: string;
  testingInstructions: TestingInstruction[];
  recommendedParts: RecommendedPart[];
  safetyNotes: string[];
  additionalRecommendations: string[];
}

export interface TestingInstruction {
  step: number;
  description: string;
  warningNote?: string;
  completed: boolean;
}

export interface RecommendedPart {
  name: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
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
  sensorData?: any;
  images?: string[];
  commonPatterns?: {
    commonIssues: string[];
    likelyParts: string[];
    confidence: number;
  };
} 