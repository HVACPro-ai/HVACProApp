export * from './diagnosticState';
export * from './aiTypes';
export * from './equipment';

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