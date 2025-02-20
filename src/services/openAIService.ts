import type { 
  AIAnalysisResult,
  SensorAnalysis,
  ImageAnalysis,
  DiagnosticState,
  SensorData,
  EquipmentTypeInfo 
} from '../types/index';

export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  private constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private async makeOpenAIRequest(messages: any[], temperature: number = 0.7): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          temperature,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content || '';
    } catch (error) {
      console.error('Error making OpenAI request:', error);
      throw new Error('Failed to communicate with OpenAI');
    }
  }

  public async analyzeIssue(diagnostic: DiagnosticState): Promise<AIAnalysisResult> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an expert HVAC diagnostic assistant."
      },
      {
        role: "user",
        content: JSON.stringify(diagnostic)
      }
    ]);

    try {
      const parsedResponse = JSON.parse(response);
      return {
        issue: parsedResponse.issue || '',
        confidence: parsedResponse.confidence || 0,
        explanation: parsedResponse.explanation || '',
        testingInstructions: parsedResponse.testingInstructions || [],
        recommendedParts: parsedResponse.recommendedParts || [],
        safetyNotes: parsedResponse.safetyNotes || [],
        additionalRecommendations: parsedResponse.additionalRecommendations || []
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse diagnostic analysis');
    }
  }

  public async analyzeSensorData(data: Record<string, number>): Promise<SensorAnalysis> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an expert HVAC sensor data analyst."
      },
      {
        role: "user",
        content: JSON.stringify(data)
      }
    ]);

    return {
      anomalies: [],
      recommendations: [],
      efficiency: 0,
      readings: {
        temperature: null,
        pressure: null,
        humidity: null,
        airflow: null
      }
    };
  }

  public async analyzeImages(images: string[]): Promise<ImageAnalysis> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an expert HVAC equipment visual inspector."
      },
      {
        role: "user",
        content: JSON.stringify(images)
      }
    ]);

    return {
      analysis: response,
      detectedIssues: [],
      confidence: 0,
      annotations: []
    };
  }

  public async analyzeDiagnostics(context: {
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
  }): Promise<AIAnalysisResult> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an expert HVAC diagnostic assistant. Analyze the provided information and provide detailed diagnostic insights."
      },
      {
        role: "user",
        content: JSON.stringify(context)
      }
    ]);

    return this.parseDiagnosticResponse(response);
  }

  public async analyzeSensorReadings(sensorData: DiagnosticState['sensorData']): Promise<SensorAnalysis> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an expert HVAC sensor data analyst. Analyze the provided sensor readings and identify any anomalies or issues."
      },
      {
        role: "user",
        content: JSON.stringify(sensorData)
      }
    ]);

    return this.parseSensorAnalysis(response);
  }

  public async analyzeEquipmentImages(images: string[]): Promise<ImageAnalysis> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an expert HVAC equipment visual inspector. Analyze the provided image descriptions and identify potential issues."
      },
      {
        role: "user",
        content: JSON.stringify(images)
      }
    ]);

    return {
      analysis: response,
      detectedIssues: [],
      confidence: 0.8,
      annotations: []
    };
  }

  private buildDiagnosticPrompt(context: {
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
  }): string {
    const equipmentType = context.equipment.type as keyof typeof this.equipmentPrompts;
    const specificPrompt = this.equipmentPrompts[equipmentType] || this.equipmentPrompts.ac;
    
    return `
      ${specificPrompt.specific}

      EQUIPMENT DETAILS:
      Type: ${context.equipment.type}
      Brand: ${context.equipment.brand}
      Model: ${context.equipment.model}
      Serial: ${context.equipment.serial}

      REPORTED SYMPTOMS:
      ${context.symptoms.map(s => `• ${s}`).join('\n')}

      DIAGNOSTIC RESPONSES:
      ${Object.entries(context.answers)
        .map(([q, a]) => `Q: ${q}\nA: ${a}`)
        .join('\n\n')}

      ${context.sensorData ? `
      SENSOR READINGS:
      • Temperature: ${context.sensorData.temperature}°F
      • Pressure: ${context.sensorData.pressure} PSI
      • Humidity: ${context.sensorData.humidity}%
      • Airflow: ${context.sensorData.airflow} CFM
      ${context.sensorData.powerConsumption ? `• Power Consumption: ${context.sensorData.powerConsumption} kW` : ''}
      ${context.sensorData.noiseLevel ? `• Noise Level: ${context.sensorData.noiseLevel} dB` : ''}
      ` : ''}

      Please provide a detailed analysis in the following JSON format:
      {
        "issue": "Primary issue description",
        "confidence": 0.XX,
        "explanation": "Detailed explanation of the diagnosis",
        "testingInstructions": [
          {
            "step": 1,
            "description": "Step description",
            "warningNote": "Optional safety warning"
          }
        ],
        "recommendedParts": [
          {
            "name": "Part name",
            "priority": "high|medium|low",
            "reason": "Why this part is needed"
          }
        ],
        "safetyNotes": ["Any critical safety considerations"],
        "additionalRecommendations": ["Other recommendations"]
      }
    `;
  }

  private buildSensorDataPrompt(sensorData: any): string {
    return `
      Analyze these HVAC sensor readings:
      
      - Temperature: ${sensorData.temperature}°F
      - Pressure: ${sensorData.pressure} PSI
      - Humidity: ${sensorData.humidity}%
      - Airflow: ${sensorData.airflow} CFM
      ${sensorData.powerConsumption ? `- Power Consumption: ${sensorData.powerConsumption} kW` : ''}
      ${sensorData.noiseLevel ? `- Noise Level: ${sensorData.noiseLevel} dB` : ''}
      
      Please identify:
      1. Any anomalies in the readings
      2. Potential system issues indicated by these values
      3. Recommended actions based on the data
    `;
  }

  private parseDiagnosticResponse(response: string): AIAnalysisResult {
    try {
      let parsedResponse: any;
      
      try {
        parsedResponse = JSON.parse(response);
      } catch (e) {
        // If JSON parsing fails, try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid response format');
        }
      }

      const {
        issue,
        confidence,
        explanation,
        testingInstructions,
        recommendedParts,
        safetyNotes,
        additionalRecommendations
      } = parsedResponse;

      // Validate and transform testing instructions
      const formattedInstructions = testingInstructions.map((instruction: any, index: number) => ({
        step: instruction.step || index + 1,
        description: instruction.description,
        warningNote: instruction.warningNote || null,
        completed: false
      }));

      // Validate and transform recommended parts
      const formattedParts = recommendedParts.map((part: any) => ({
        name: part.name,
        priority: part.priority || 'medium',
        reason: part.reason || 'Replacement recommended'
      }));

      return {
        issue: issue || 'Unknown issue',
        confidence: parseFloat(confidence) || 0.75,
        explanation: explanation || 'No detailed explanation provided',
        testingInstructions: formattedInstructions,
        recommendedParts: formattedParts,
        safetyNotes: safetyNotes || [],
        additionalRecommendations: additionalRecommendations || []
      };
    } catch (error) {
      console.error('Error parsing diagnostic response:', error);
      return {
        issue: 'Error analyzing diagnostics',
        confidence: 0.5,
        explanation: 'Failed to parse AI response',
        testingInstructions: [],
        recommendedParts: [],
        safetyNotes: ['Unable to provide safety analysis'],
        additionalRecommendations: ['Please consult a qualified technician']
      };
    }
  }

  private parseSensorAnalysis(response: string): SensorAnalysis {
    try {
      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(response);
      } catch (e) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      }

      return {
        anomalies: parsedResponse.anomalies || [],
        recommendations: parsedResponse.recommendations || [],
        efficiency: parsedResponse.efficiency || 0.75,
        readings: {
          temperature: this.validateReading(parsedResponse.readings?.temperature),
          pressure: this.validateReading(parsedResponse.readings?.pressure),
          humidity: this.validateReading(parsedResponse.readings?.humidity),
          airflow: this.validateReading(parsedResponse.readings?.airflow)
        }
      };
    } catch (error) {
      console.error('Error parsing sensor analysis:', error);
      return {
        anomalies: ['Error analyzing sensor data'],
        recommendations: ['Please verify sensor readings manually'],
        efficiency: 0.5,
        readings: {
          temperature: null,
          pressure: null,
          humidity: null,
          airflow: null
        }
      };
    }
  }

  private validateReading(value: any): number | null {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  public async getEfficiencyRecommendations(diagnosticState: DiagnosticState): Promise<string[]> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an HVAC efficiency expert. Provide practical recommendations for improving system performance and energy efficiency."
      },
      {
        role: "user",
        content: JSON.stringify(diagnosticState)
      }
    ]);

    try {
      return JSON.parse(response);
    } catch {
      return response.split('\n').filter(line => line.trim());
    }
  }

  public async getMaintenanceSchedule(equipment: EquipmentTypeInfo): Promise<{
    daily: string[];
    monthly: string[];
    quarterly: string[];
    annual: string[];
  }> {
    const response = await this.makeOpenAIRequest([
      {
        role: "system",
        content: "You are an HVAC maintenance expert. Create detailed maintenance schedules based on equipment type and specifications."
      },
      {
        role: "user",
        content: JSON.stringify(equipment)
      }
    ]);

    try {
      const schedule = JSON.parse(response);
      return {
        daily: schedule.daily || [],
        monthly: schedule.monthly || [],
        quarterly: schedule.quarterly || [],
        annual: schedule.annual || []
      };
    } catch {
      return {
        daily: ['Check system operation'],
        monthly: ['Basic system inspection'],
        quarterly: ['Professional maintenance recommended'],
        annual: ['Full system inspection required']
      };
    }
  }
} 