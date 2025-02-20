import type { AIQuestion, DiagnosticState } from '../types';

const INITIAL_QUESTIONS: { [key: string]: AIQuestion } = {
  'start': {
    id: 'start',
    text: 'Is the unit receiving power?',
    type: 'yes_no',
    options: [],
  },
  'power_yes': {
    id: 'power_yes',
    text: 'Is the unit making any unusual noises?',
    type: 'multiple_choice',
    options: ['No noise', 'Buzzing', 'Clicking', 'Rattling', 'Squealing'],
  },
  'power_no': {
    id: 'power_no',
    text: 'Have you checked the circuit breaker?',
    type: 'yes_no',
    options: [],
  },
  // Add more questions as needed
};

export class AIDiagnosticService {
  static async getNextQuestion(
    currentQuestionId: string | null,
    answer: string,
    diagnosticState: DiagnosticState
  ): Promise<AIQuestion | null> {
    // In a real implementation, this would make an API call
    // For now, we'll use a simple logic tree
    
    if (!currentQuestionId) {
      return INITIAL_QUESTIONS['start'];
    }

    switch (currentQuestionId) {
      case 'start':
        return answer === 'yes' 
          ? INITIAL_QUESTIONS['power_yes']
          : INITIAL_QUESTIONS['power_no'];
      
      case 'power_yes':
        // Logic for noise-based diagnosis
        return null; // End of questions, ready for diagnosis
      
      case 'power_no':
        // Logic for power-related issues
        return null; // End of questions, ready for diagnosis
      
      default:
        return null;
    }
  }

  static async getDiagnosis(diagnosticState: DiagnosticState): Promise<{
    issue: string;
    confidence: number;
    testingInstructions: string[];
    requiredParts: string[];
  }> {
    // In a real implementation, this would analyze all answers and make an API call
    // For now, return a mock diagnosis
    return {
      issue: "Faulty capacitor",
      confidence: 0.85,
      testingInstructions: [
        "Check capacitor with multimeter",
        "Verify voltage readings",
        "Inspect for physical damage"
      ],
      requiredParts: ["CAP-123"]
    };
  }
} 