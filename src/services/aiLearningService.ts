import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiagnosticState, AIAnalysisResult, EquipmentTypeInfo } from '../types/index';

interface DiagnosticFeedback {
  diagnosticId: string;
  wasCorrect: boolean;
  actualIssue: string;
  timestamp: number;
  equipmentType: EquipmentTypeInfo;
  symptoms: string[];
  initialDiagnosis: string;
  confirmedParts: string[];
  technicalNotes: string;
}

interface LearningData {
  successfulDiagnoses: DiagnosticFeedback[];
  equipmentPatterns: {
    [key: string]: {
      symptoms: { [key: string]: number };
      issues: { [key: string]: number };
      parts: { [key: string]: number };
    };
  };
  confidenceMetrics: {
    overall: number;
    byEquipmentType: { [key: string]: number };
  };
}

export class AILearningService {
  private static instance: AILearningService;
  private learningData: LearningData;
  private readonly STORAGE_KEY = 'ai_learning_data';

  private constructor() {
    this.learningData = {
      successfulDiagnoses: [],
      equipmentPatterns: {},
      confidenceMetrics: {
        overall: 0.75,
        byEquipmentType: {}
      }
    };
  }

  public static getInstance(): AILearningService {
    if (!AILearningService.instance) {
      AILearningService.instance = new AILearningService();
    }
    return AILearningService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const storedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        this.learningData = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error initializing AI learning data:', error);
    }
  }

  public async recordDiagnosticFeedback(feedback: DiagnosticFeedback): Promise<void> {
    try {
      // Add to successful diagnoses if correct
      if (feedback.wasCorrect) {
        this.learningData.successfulDiagnoses.push(feedback);
      }

      // Update equipment patterns
      const equipmentKey = `${feedback.equipmentType.type}_${feedback.equipmentType.brand}`;
      if (!this.learningData.equipmentPatterns[equipmentKey]) {
        this.learningData.equipmentPatterns[equipmentKey] = {
          symptoms: {},
          issues: {},
          parts: {}
        };
      }

      // Update symptom frequencies
      feedback.symptoms.forEach(symptom => {
        const patterns = this.learningData.equipmentPatterns[equipmentKey];
        patterns.symptoms[symptom] = (patterns.symptoms[symptom] || 0) + 1;
        patterns.issues[feedback.actualIssue] = (patterns.issues[feedback.actualIssue] || 0) + 1;
        feedback.confirmedParts.forEach(part => {
          patterns.parts[part] = (patterns.parts[part] || 0) + 1;
        });
      });

      // Update confidence metrics
      this.updateConfidenceMetrics(feedback);

      // Save updated learning data
      await this.saveLearningData();
    } catch (error) {
      console.error('Error recording diagnostic feedback:', error);
    }
  }

  public async getRelevantPatterns(
    equipmentType: EquipmentTypeInfo,
    symptoms: string[]
  ): Promise<{
    commonIssues: string[];
    likelyParts: string[];
    confidence: number;
  }> {
    const equipmentKey = `${equipmentType.type}_${equipmentType.brand}`;
    const patterns = this.learningData.equipmentPatterns[equipmentKey];

    if (!patterns) {
      return {
        commonIssues: [],
        likelyParts: [],
        confidence: this.learningData.confidenceMetrics.overall
      };
    }

    // Find most common issues for these symptoms
    const relevantIssues = Object.entries(patterns.issues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);

    // Find most commonly replaced parts
    const relevantParts = Object.entries(patterns.parts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([part]) => part);

    return {
      commonIssues: relevantIssues,
      likelyParts: relevantParts,
      confidence: this.learningData.confidenceMetrics.byEquipmentType[equipmentType.type] || 
                 this.learningData.confidenceMetrics.overall
    };
  }

  private updateConfidenceMetrics(feedback: DiagnosticFeedback): void {
    const { type } = feedback.equipmentType;
    const typeMetrics = this.learningData.confidenceMetrics.byEquipmentType;

    // Update equipment-specific confidence
    if (!typeMetrics[type]) {
      typeMetrics[type] = feedback.wasCorrect ? 0.76 : 0.74;
    } else {
      typeMetrics[type] = feedback.wasCorrect
        ? typeMetrics[type] * 0.95 + 0.05 // Slight increase for correct diagnosis
        : typeMetrics[type] * 0.95; // Slight decrease for incorrect diagnosis
    }

    // Update overall confidence
    const totalDiagnoses = this.learningData.successfulDiagnoses.length;
    this.learningData.confidenceMetrics.overall = 
      (this.learningData.confidenceMetrics.overall * totalDiagnoses + (feedback.wasCorrect ? 1 : 0)) / 
      (totalDiagnoses + 1);
  }

  private async saveLearningData(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.learningData));
    } catch (error) {
      console.error('Error saving AI learning data:', error);
    }
  }

  public async getSuccessRate(): Promise<{
    overall: number;
    byEquipmentType: { [key: string]: number };
  }> {
    const totalDiagnoses = this.learningData.successfulDiagnoses.length;
    const byType: { [key: string]: { success: number; total: number } } = {};

    this.learningData.successfulDiagnoses.forEach(diagnosis => {
      const { type } = diagnosis.equipmentType;
      if (!byType[type]) {
        byType[type] = { success: 0, total: 0 };
      }
      byType[type].total++;
      if (diagnosis.wasCorrect) {
        byType[type].success++;
      }
    });

    return {
      overall: totalDiagnoses > 0 ? 
        this.learningData.successfulDiagnoses.filter(d => d.wasCorrect).length / totalDiagnoses : 0,
      byEquipmentType: Object.fromEntries(
        Object.entries(byType).map(([type, data]) => [
          type,
          data.total > 0 ? data.success / data.total : 0
        ])
      )
    };
  }

  public async trainModel(historicalData: DiagnosticState[]): Promise<void> {
    // Implementation
  }

  public async getPrediction(data: DiagnosticState): Promise<AIAnalysisResult> {
    return {
      issue: '',
      confidence: 0,
      explanation: '',
      testingInstructions: [],
      recommendedParts: [],
      safetyNotes: [],
      additionalRecommendations: []
    };
  }
}

export async function trainModel(historicalData: DiagnosticState[]): Promise<void> {
  // Implementation
}

export async function getPrediction(data: DiagnosticState): Promise<AIAnalysisResult> {
  // Implementation
  return {
    issue: '',
    confidence: 0,
    explanation: '',
    testingInstructions: [],
    recommendedParts: [],
    safetyNotes: [],
    additionalRecommendations: []
  };
} 