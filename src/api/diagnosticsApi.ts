import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api'; // Replace with your backend URL

// Enhanced interfaces for AI-powered diagnostics
interface DiagnosticRequest {
  modelNumber: string;
  serialNumber: string;
  symptoms: string[];
  sensorData?: {
    temperature: number;
    pressure: number;
    humidity: number;
    airflow: number;
    powerConsumption: number;
    noiseLevel?: number;
  };
  imageUrls?: string[]; // For visual analysis of equipment
  maintenanceHistory?: {
    lastService: Date;
    previousIssues: string[];
    replacedParts: string[];
  };
}

interface DiagnosticResponse {
  diagnosis: string;
  confidence: number;
  recommendedActions: string[];
  estimatedCost?: number;
  partsSuggested?: string[];
  severity: 'low' | 'medium' | 'high';
  aiAnalysis: {
    predictionAccuracy: number;
    potentialRootCauses: string[];
    failureProbability: number;
    recommendedMaintenance: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
    similarCases?: {
      description: string;
      resolution: string;
      successRate: number;
    }[];
    energyEfficiencyImpact?: {
      current: number;
      afterFix: number;
      potentialSavings: number;
    };
  };
}

// Enhanced diagnostic functions
export const fetchDiagnostics = async (
  modelNumber: string,
  serialNumber: string,
  symptoms: string[],
  sensorData?: DiagnosticRequest['sensorData'],
  imageUrls?: string[]
): Promise<DiagnosticResponse> => {
  const response = await axios.post(`${API_URL}/diagnostics`, {
    modelNumber,
    serialNumber,
    symptoms,
    sensorData,
    imageUrls
  });
  return response.data;
};

// New function for real-time monitoring and predictive diagnostics
export const startPredictiveMonitoring = async (
  modelNumber: string,
  serialNumber: string,
  callback: (prediction: PredictiveAlert) => void
): Promise<() => void> => {
  // Implementation would depend on your backend websocket/polling setup
  // Returns a cleanup function to stop monitoring
  return () => {
    // Cleanup logic
  };
};

// Interface for predictive alerts
interface PredictiveAlert {
  timestamp: Date;
  alertType: 'warning' | 'critical' | 'info';
  message: string;
  predictedIssue?: string;
  recommendedAction?: string;
  confidence: number;
  timeToFailure?: {
    hours: number;
    confidence: number;
  };
}

// Function to analyze equipment images
export const analyzeEquipmentImages = async (
  imageUrls: string[]
): Promise<ImageAnalysisResult> => {
  const response = await axios.post(`${API_URL}/diagnostics/image-analysis`, {
    imageUrls
  });
  return response.data;
};

interface ImageAnalysisResult {
  detectedIssues: {
    description: string;
    location: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendations: string[];
  requiresExpertReview: boolean;
}

// Function to get efficiency optimization suggestions
export const getEfficiencyOptimizations = async (
  modelNumber: string,
  serialNumber: string,
  currentSettings: SystemSettings
): Promise<OptimizationSuggestions> => {
  const response = await axios.post(`${API_URL}/diagnostics/optimize`, {
    modelNumber,
    serialNumber,
    currentSettings
  });
  return response.data;
};

interface SystemSettings {
  temperature: number;
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

interface OptimizationSuggestions {
  recommendedSettings: SystemSettings;
  potentialSavings: {
    energyPercent: number;
    costPerMonth: number;
  };
  comfort: {
    impact: 'none' | 'minimal' | 'moderate' | 'significant';
    details: string;
  };
} 