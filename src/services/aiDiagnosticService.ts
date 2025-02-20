import type { 
  AIQuestion, 
  DiagnosticState, 
  AIAnalysisResult,
  DiagnosticContext,
  SensorData,
  RecommendedPart
} from '../types/index';
import { OpenAIService } from './openAIService';
import { AILearningService } from './aiLearningService';

interface EquipmentTypeInfo {
  type: 'furnace' | 'ac' | 'minisplit';
  brand: string;
  series?: string;
}

const EQUIPMENT_PATTERNS = {
  // Carrier
  CARRIER_AC: /^24[A-Z]/,
  CARRIER_FURNACE: /^58[A-Z]/,
  CARRIER_MINISPLIT: /^38[A-Z]/,
  
  // Trane
  TRANE_AC: /^4[A-Z]/,
  TRANE_FURNACE: /^[A-Z]8[A-Z]/,
  
  // Lennox
  LENNOX_AC: /^13[A-Z]/,
  LENNOX_FURNACE: /^[A-Z]L[A-Z]/,
  
  // Goodman
  GOODMAN_AC: /^GSX/,
  GOODMAN_FURNACE: /^GM/,
  GOODMAN_MINISPLIT: /^MS/,
  
  // Rheem
  RHEEM_AC: /^RA[0-9]/,
  RHEEM_FURNACE: /^R[0-9]P/,
  
  // York
  YORK_AC: /^YC[A-Z]/,
  YORK_FURNACE: /^TM[0-9]/,
};

const INITIAL_QUESTIONS: { [key: string]: AIQuestion } = {
  'start': {
    id: 'start',
    text: 'Is the unit receiving power?',
    type: 'yes_no',
    options: [],
    nextQuestionMap: {
      'yes': 'power_yes',
      'no': 'power_no'
    }
  },
  'power_yes': {
    id: 'power_yes',
    text: 'Is the unit making any unusual noises?',
    type: 'multiple_choice',
    options: ['No noise', 'Buzzing', 'Clicking', 'Rattling', 'Squealing'],
    nextQuestionMap: {
      'No noise': 'operation_check',
      'Buzzing': 'electrical_check',
      'Clicking': 'thermostat_check',
      'Rattling': 'mechanical_check',
      'Squealing': 'belt_check'
    }
  },
  'power_no': {
    id: 'power_no',
    text: 'Have you checked the circuit breaker?',
    type: 'yes_no',
    options: [],
    nextQuestionMap: {
      'yes': 'breaker_yes',
      'no': 'check_breaker'
    }
  },
  // Add more questions as needed
};

interface PartInput {
  partNumber?: string;
  name?: string;
  description?: string;
  availability?: boolean;
  priority?: string;
  reason?: string;
  price?: number;
}

export class AIDiagnosticService {
  private static instance: AIDiagnosticService;
  private openAI: OpenAIService;
  private learningService: AILearningService;
  private questionBank: { [key: string]: AIQuestion };

  private constructor() {
    this.openAI = OpenAIService.getInstance();
    this.learningService = AILearningService.getInstance();
    this.questionBank = this.initializeQuestionBank();
  }

  private initializeQuestionBank(): { [key: string]: AIQuestion } {
    return {
      start: {
        id: 'start',
        text: 'What is the main issue you are experiencing?',
        type: 'multiple_choice',
        options: [
          'No power',
          'Not cooling/heating',
          'Poor performance',
          'Strange noises',
          'System cycling frequently',
          'High energy bills',
          'Other'
        ],
        nextQuestionMap: {
          'No power': 'power_diagnosis',
          'Not cooling/heating': 'operation_check',
          'Poor performance': 'performance_check',
          'Strange noises': 'noise_diagnosis',
          'System cycling frequently': 'cycling_check',
          'High energy bills': 'efficiency_check',
          'Other': 'general_diagnosis'
        }
      },
      power_diagnosis: {
        id: 'power_diagnosis',
        text: 'Let\'s check the power supply. Is the circuit breaker on?',
        type: 'yes_no',
        options: [],
        nextQuestionMap: {
          'yes': 'voltage_check',
          'no': 'breaker_check'
        }
      },
      // Add more detailed questions...
    };
  }

  public static getInstance(): AIDiagnosticService {
    if (!AIDiagnosticService.instance) {
      AIDiagnosticService.instance = new AIDiagnosticService();
    }
    return AIDiagnosticService.instance;
  }

  public static async getNextQuestion(
    currentQuestionId: string,
    answer: string,
    diagnosticState: DiagnosticState
  ): Promise<AIQuestion | null> {
    const instance = AIDiagnosticService.getInstance();
    const currentQuestion = instance.questionBank[currentQuestionId];

    if (!currentQuestion) {
      throw new Error('Invalid question ID');
    }

    // Store the answer
    diagnosticState.answers[currentQuestionId] = answer;

    // Get next question based on answer
    const nextQuestionId = currentQuestion.nextQuestionMap[answer];
    if (!nextQuestionId) {
      return null; // End of questions
    }

    return instance.questionBank[nextQuestionId];
  }

  public async getDiagnosis(diagnosticState: DiagnosticState): Promise<AIAnalysisResult> {
    try {
      // Get learned patterns
      const patterns = await this.learningService.getRelevantPatterns(
        diagnosticState.equipmentType!,
        diagnosticState.symptoms
      );

      const context: DiagnosticContext = {
        equipment: {
          type: diagnosticState.equipmentType?.type || 'unknown',
          brand: diagnosticState.brand,
          model: diagnosticState.modelNumber,
          serial: diagnosticState.serialNumber
        },
        symptoms: diagnosticState.symptoms,
        answers: diagnosticState.answers,
        sensorData: this.validateSensorData(diagnosticState.sensorData),
        commonPatterns: patterns
      };

      // Combine AI analysis with learned patterns
      const aiAnalysis = await this.openAI.analyzeDiagnostics(context);

      // Transform all parts to ensure they match RecommendedPart type
      const aiParts: RecommendedPart[] = (aiAnalysis.recommendedParts || []).map((part: string | PartInput) => ({
        partNumber: typeof part === 'string' ? part : part.partNumber || 'unknown',
        name: typeof part === 'string' ? part : part.name || 'Unknown Part',
        description: typeof part === 'string' ? 'No description' : (part.description || 'No description'),
        availability: typeof part === 'string' ? false : (part.availability || false),
        priority: 'medium' as const,
        reason: 'AI recommended'
      }));

      const patternParts: RecommendedPart[] = (patterns.likelyParts || []).map((part: string | PartInput) => ({
        partNumber: typeof part === 'string' ? part : part.partNumber || 'unknown',
        name: typeof part === 'string' ? part : part.name || 'Unknown Part',
        description: typeof part === 'string' ? 'Historical part' : (part.description || 'Historical part'),
        availability: typeof part === 'string' ? false : (part.availability || false),
        priority: 'medium' as const,
        reason: 'Based on historical data'
      }));

      return {
        ...aiAnalysis,
        confidence: (aiAnalysis.confidence + patterns.confidence) / 2,
        recommendedParts: [...aiParts, ...patternParts]
      };
    } catch (error) {
      console.error('Error in diagnosis:', error);
      throw new Error('Failed to generate diagnosis');
    }
  }

  public async submitDiagnosticFeedback(
    diagnosticId: string,
    wasCorrect: boolean,
    actualIssue: string,
    confirmedParts: string[],
    technicalNotes: string
  ): Promise<void> {
    try {
      const diagnosticState = await this.getDiagnosticState(diagnosticId);
      await this.learningService.recordDiagnosticFeedback({
        diagnosticId,
        wasCorrect,
        actualIssue,
        timestamp: Date.now(),
        equipmentType: diagnosticState.equipmentType!,
        symptoms: diagnosticState.symptoms,
        initialDiagnosis: diagnosticState.confirmedIssue || '',
        confirmedParts,
        technicalNotes
      });
    } catch (error) {
      console.error('Error submitting diagnostic feedback:', error);
    }
  }

  public static async analyzeSensorData(sensorData: DiagnosticState['sensorData']) {
    const instance = AIDiagnosticService.getInstance();
    
    try {
      if (!sensorData) {
        throw new Error('No sensor data provided');
      }

      const analysis = await instance.openAI.analyzeSensorReadings(sensorData);
      return analysis;
    } catch (error) {
      console.error('Error analyzing sensor data:', error);
      throw new Error('Failed to analyze sensor data');
    }
  }

  public static async analyzeImages(images: string[]) {
    const instance = AIDiagnosticService.getInstance();
    
    try {
      if (!images.length) {
        throw new Error('No images provided');
      }

      const analysis = await instance.openAI.analyzeEquipmentImages(images);
      return analysis;
    } catch (error) {
      console.error('Error analyzing images:', error);
      throw new Error('Failed to analyze images');
    }
  }

  public static detectEquipmentType(modelNumber: string, brand: string): EquipmentTypeInfo {
    const normalizedBrand = brand.toLowerCase();
    const normalizedModel = modelNumber.toUpperCase();

    switch (normalizedBrand) {
      case 'carrier':
        if (EQUIPMENT_PATTERNS.CARRIER_AC.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.CARRIER_FURNACE.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.CARRIER_MINISPLIT.test(normalizedModel)) return { type: 'minisplit', brand: normalizedBrand };
        break;

      case 'trane':
        if (EQUIPMENT_PATTERNS.TRANE_AC.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.TRANE_FURNACE.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
        break;

      case 'lennox':
        if (EQUIPMENT_PATTERNS.LENNOX_AC.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.LENNOX_FURNACE.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
        break;

      case 'goodman':
        if (EQUIPMENT_PATTERNS.GOODMAN_AC.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.GOODMAN_FURNACE.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.GOODMAN_MINISPLIT.test(normalizedModel)) return { type: 'minisplit', brand: normalizedBrand };
        break;

      case 'rheem':
        if (EQUIPMENT_PATTERNS.RHEEM_AC.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.RHEEM_FURNACE.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
        break;

      case 'york':
        if (EQUIPMENT_PATTERNS.YORK_AC.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
        if (EQUIPMENT_PATTERNS.YORK_FURNACE.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
        break;
    }

    // If no specific pattern matches, try to guess based on model number patterns
    if (/COOL|AC|COND/i.test(normalizedModel)) return { type: 'ac', brand: normalizedBrand };
    if (/HEAT|FURN|GAS/i.test(normalizedModel)) return { type: 'furnace', brand: normalizedBrand };
    if (/MINI|SPLIT|DUCT/i.test(normalizedModel)) return { type: 'minisplit', brand: normalizedBrand };

    // Default fallback
    return { type: 'ac', brand: normalizedBrand };
  }

  public static getQuestionsByType(equipmentType: EquipmentTypeInfo): { [key: string]: AIQuestion } {
    const baseQuestions = {
      'start': {
        id: 'start',
        text: 'Is the unit receiving power?',
        type: 'yes_no' as const,
        options: [],
        nextQuestionMap: {
          'yes': 'operation',
          'no': 'power_check'
        }
      }
    };

    switch (equipmentType.type) {
      case 'ac':
        return {
          ...baseQuestions,
          'cooling': {
            id: 'cooling',
            text: 'Is the unit cooling properly?',
            type: 'multiple_choice',
            options: [
              'Not cooling at all',
              'Cooling but not enough',
              'Intermittent cooling',
              'Working fine'
            ],
            nextQuestionMap: {
              'Not cooling at all': 'power_check',
              'Cooling but not enough': 'airflow_check',
              'Intermittent cooling': 'thermostat_check',
              'Working fine': 'maintenance'
            }
          },
          'noise': {
            id: 'noise',
            text: 'Are you hearing any unusual noises?',
            type: 'multiple_choice',
            options: [
              'No unusual noise',
              'Squealing',
              'Grinding',
              'Rattling',
              'Humming'
            ],
            nextQuestionMap: {
              'No unusual noise': 'maintenance',
              'Squealing': 'belt_check',
              'Grinding': 'bearing_check',
              'Rattling': 'loose_parts',
              'Humming': 'electrical_check'
            }
          }
        };

      case 'furnace':
        return {
          ...baseQuestions,
          'heating': {
            id: 'heating',
            text: 'Is the furnace heating?',
            type: 'multiple_choice',
            options: [
              'No heat',
              'Insufficient heat',
              'Intermittent heating',
              'Working fine'
            ],
            nextQuestionMap: {
              'No heat': 'gas_check',
              'Insufficient heat': 'filter_check',
              'Intermittent heating': 'thermostat_check',
              'Working fine': 'maintenance'
            }
          },
          'flame': {
            id: 'flame',
            text: 'What color is the flame?',
            type: 'multiple_choice',
            options: [
              'Blue',
              'Yellow/Orange',
              'No flame',
              "Can't see flame"
            ],
            nextQuestionMap: {
              'Blue': 'normal_operation',
              'Yellow/Orange': 'combustion_check',
              'No flame': 'gas_valve_check',
              "Can't see flame": 'access_panel_check'
            }
          }
        };

      case 'minisplit':
        return {
          ...baseQuestions,
          'operation': {
            id: 'operation',
            text: 'What mode is not working properly?',
            type: 'multiple_choice',
            options: [
              'Cooling',
              'Heating',
              'Fan only',
              'Dehumidification',
              'All modes'
            ],
            nextQuestionMap: {
              'Cooling': 'cooling_check',
              'Heating': 'heating_check',
              'Fan only': 'fan_check',
              'Dehumidification': 'sensor_check',
              'All modes': 'power_check'
            }
          }
        };

      default:
        return baseQuestions; // Default return for type safety
    }
  }

  public async startDiagnosticSession(equipmentType: EquipmentTypeInfo): Promise<{
    initialQuestion: AIQuestion;
    context: any;
  }> {
    const context = {
      equipmentType,
      diagnosticPath: [],
      findings: {},
      currentFlow: null
    };

    return {
      initialQuestion: this.questionBank.start,
      context
    };
  }

  public async processAnswer(
    currentQuestion: AIQuestion,
    answer: string,
    diagnosticState: DiagnosticState
  ): Promise<{
    nextQuestion: AIQuestion | null;
    analysis: any;
    recommendations: string[];
  }> {
    try {
      // Store the answer
      const updatedState = {
        ...diagnosticState,
        answers: {
          ...diagnosticState.answers,
          [currentQuestion.id]: answer
        }
      };

      // Get intermediate analysis if needed
      let analysis = null;
      if (this.shouldAnalyze(currentQuestion.id)) {
        analysis = await this.getIntermediateAnalysis(updatedState);
      }

      // Determine next question
      const nextQuestionId = currentQuestion.nextQuestionMap[answer];
      const nextQuestion = nextQuestionId ? this.questionBank[nextQuestionId] : null;

      // Get recommendations if this is the end of a diagnostic path
      const recommendations = nextQuestion ? [] : await this.getFinalRecommendations(updatedState);

      return {
        nextQuestion,
        analysis,
        recommendations
      };
    } catch (error) {
      console.error('Error processing answer:', error);
      throw new Error('Failed to process diagnostic answer');
    }
  }

  private shouldAnalyze(questionId: string): boolean {
    // Define questions that should trigger intermediate analysis
    const analysisPoints = [
      'power_diagnosis',
      'operation_check',
      'performance_check',
      'noise_diagnosis'
    ];
    return analysisPoints.includes(questionId);
  }

  private async getIntermediateAnalysis(state: DiagnosticState) {
    try {
      return await this.openAI.analyzeDiagnostics({
        equipment: {
          type: state.equipmentType?.type || 'unknown',
          brand: state.brand,
          model: state.modelNumber,
          serial: state.serialNumber
        },
        symptoms: state.symptoms,
        answers: state.answers,
        sensorData: this.validateSensorData(state.sensorData)
      });
    } catch (error) {
      console.error('Error getting intermediate analysis:', error);
      return null;
    }
  }

  private async getFinalRecommendations(state: DiagnosticState): Promise<string[]> {
    try {
      const analysis = await this.openAI.analyzeDiagnostics({
        equipment: {
          type: state.equipmentType?.type || 'unknown',
          brand: state.brand,
          model: state.modelNumber,
          serial: state.serialNumber
        },
        symptoms: state.symptoms,
        answers: state.answers,
        sensorData: this.validateSensorData(state.sensorData)
      });

      return analysis.additionalRecommendations || [];
    } catch (error) {
      console.error('Error getting final recommendations:', error);
      return ['Please consult a qualified technician for further diagnosis'];
    }
  }

  private async getDiagnosticState(diagnosticId: string): Promise<DiagnosticState> {
    // Implement this method to retrieve diagnostic state
    // This could be from a local storage or API
    throw new Error('Not implemented');
  }

  private validateSensorData(data?: Partial<SensorData>): Partial<SensorData> | undefined {
    if (!data) return undefined;
    
    const validatedData: Partial<SensorData> = {};
    
    if (typeof data.temperature === 'number') validatedData.temperature = data.temperature;
    if (typeof data.pressure === 'number') validatedData.pressure = data.pressure;
    if (typeof data.humidity === 'number') validatedData.humidity = data.humidity;
    if (typeof data.airflow === 'number') validatedData.airflow = data.airflow;
    if (typeof data.powerConsumption === 'number') validatedData.powerConsumption = data.powerConsumption;
    if (typeof data.noiseLevel === 'number') validatedData.noiseLevel = data.noiseLevel;
    
    return Object.keys(validatedData).length > 0 ? validatedData : undefined;
  }

  private isValidPartData(part: any): part is Partial<RecommendedPart> {
    return part !== null && typeof part === 'object';
  }

  private transformRecommendedParts(rawParts: any[]): RecommendedPart[] {
    if (!Array.isArray(rawParts)) {
      return [];
    }

    return rawParts.reduce<RecommendedPart[]>((acc, rawPart) => {
      try {
        // Extract the part data, handling nested structures
        const partData = this.isValidPartData(rawPart?.name) ? rawPart.name : rawPart;
        
        if (!this.isValidPartData(partData)) {
          return acc;
        }

        // Create a new RecommendedPart with all required fields
        const transformedPart: RecommendedPart = {
          partNumber: this.getStringValue(partData.partNumber, 'unknown'),
          name: this.getStringValue(partData.name, 'Unknown Part'),
          description: this.getStringValue(partData.description, 'No description available'),
          priority: this.validatePriority(partData.priority),
          availability: this.getBooleanValue(partData.availability, false),
          reason: this.getStringValue(partData.reason, 'Replacement recommended')
        };

        // Add optional price if valid
        if (this.isValidNumber(partData.price)) {
          transformedPart.price = partData.price;
        }

        acc.push(transformedPart);
      } catch (error) {
        console.error('Error transforming part:', error);
        // Skip invalid parts instead of failing the whole transformation
      }
      return acc;
    }, []);
  }

  private getStringValue(value: any, defaultValue: string): string {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    return defaultValue;
  }

  private getBooleanValue(value: any, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const lowered = value.toLowerCase();
      if (lowered === 'true' || lowered === 'yes' || lowered === '1') {
        return true;
      }
      if (lowered === 'false' || lowered === 'no' || lowered === '0') {
        return false;
      }
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return defaultValue;
  }

  private isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  private validatePriority(priority: any): 'high' | 'medium' | 'low' {
    if (typeof priority === 'string') {
      const normalized = priority.toLowerCase();
      if (['high', 'medium', 'low'].includes(normalized)) {
        return normalized as 'high' | 'medium' | 'low';
      }
    }
    return 'medium';
  }

  public async analyzeDiagnostic(state: DiagnosticState): Promise<AIAnalysisResult> {
    try {
      const aiResponse = await this.openAI.analyzeIssue(state);
      return {
        issue: aiResponse.issue || 'Unknown issue',
        confidence: aiResponse.confidence || 0.75,
        explanation: aiResponse.explanation || 'No detailed explanation provided',
        testingInstructions: aiResponse.testingInstructions || [],
        recommendedParts: this.transformRecommendedParts(aiResponse.recommendedParts || []),
        safetyNotes: aiResponse.safetyNotes || [],
        additionalRecommendations: aiResponse.additionalRecommendations || []
      };
    } catch (error) {
      console.error('Error in analyzeDiagnostic:', error);
      throw new Error('Failed to analyze diagnostic data');
    }
  }
}

export async function analyzeDiagnostic(context: DiagnosticContext): Promise<AIAnalysisResult> {
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