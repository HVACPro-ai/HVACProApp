import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import {
  ThemedView,
  ThemedText,
  ThemedInput,
  ThemedButton,
  Card,
  NavigationButtons,
  OfflineBanner,
  AnimatedStepTransition
} from '../components';
import { ImageUploader } from '../components/diagnostics/ImageUploader';
import { StepProgress } from '../components/diagnostics/StepProgress';
import { SensorDataInput } from '../components/diagnostics/SensorDataInput';
import { AIAnalysisResults, AIAnalysisResult } from '../components/diagnostics/AIAnalysisResults';
import { DiagnosticGuide } from '../components/diagnostics/DiagnosticGuide';
import { fetchDiagnostics, analyzeEquipmentImages, getEfficiencyOptimizations } from '../api/diagnosticsApi';
import { Ionicons } from '@expo/vector-icons';
import type { ServiceImage, DiagnosticState, AIQuestion, OrderDetails, SystemSettings, SensorData, DiagnosticHistoryItem, TestingInstruction, EquipmentTypeInfo } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrandSelection } from '../components/diagnostics/BrandSelection';
import { AIQuestionPrompt } from '../components/diagnostics/AIQuestionPrompt';
import { TestingInstructions } from '../components/diagnostics/TestingInstructions';
import { InventoryStatus } from '../constants/inventory';
import { AIDiagnosticService } from '../services/aiDiagnosticService';
import { DiagnosticProgress } from '../components/diagnostics/DiagnosticProgress';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PartOrderForm } from '../components/diagnostics/PartOrderForm';
import { PartOrderService } from '../services/partOrderService';
import { OrderTracking } from '../components/diagnostics/OrderTracking';
import { StorageService } from '../services/storageService';
import { DiagnosticHistory } from '../components/diagnostics/DiagnosticHistory';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import type { DiagnosticResponse, OptimizationSuggestions } from '../api/diagnosticsApi';
import VisualAid from '../../components/VisualAid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DIAGNOSTIC_STEPS = [
  'Equipment Info',
  'Images',
  'Sensor Data',
  'Analysis'
];

interface DiagnosticsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

interface ImageUploaderProps {
  images: ServiceImage[];
  onImageAdded: (image: ServiceImage) => void;
  onImageRemoved: (index: number) => void;
}

interface SensorDataInputProps {
  data: SensorData;
  onDataChange: (data: SensorData) => void;
  error?: string;
}

interface AIAnalysisProps {
  results: AIAnalysisResult;
  onPartOrder: (partId: string) => void;
}

interface DiagnosticData {
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
  inventoryStatus?: typeof InventoryStatus[keyof typeof InventoryStatus];
}

interface AIAnalysisResult {
  suggestions: string[];
  diagnosis: string;
  confidence: number;
  recommendedParts?: string[];
}

interface DiagnosticResponse {
  analysis: AIAnalysisResult;
  questions: string[];
  suggestions: string[];
}

interface EquipmentTypeInfo {
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  category: string;
}

interface BrandSelectionProps {
  brand: string;
  onBrandSelect: (brand: string) => void;
}

interface StepProgressProps {
  steps: string[];
  currentStep: number;
  onStepPress: (step: number) => void;
}

interface NavigationButtonsProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
  loading: boolean;
}

// Type guard for EquipmentTypeInfo
const isValidEquipment = (equipment: Partial<EquipmentTypeInfo>): equipment is EquipmentTypeInfo => {
  return typeof equipment.id === 'string' &&
         typeof equipment.name === 'string' &&
         typeof equipment.category === 'string';
};

const createDefaultEquipment = (): EquipmentTypeInfo => ({
  id: 'default-equipment',
  name: 'Unknown Equipment',
  category: 'General'
});

// Fix the type conflicts between DiagnosticState and DiagnosticData
interface LocalDiagnosticState extends Partial<DiagnosticData> {
  inventoryStatus?: typeof InventoryStatus[keyof typeof InventoryStatus];
}

// Add these utility functions at the top of the file
const validateEquipmentInfo = (equipment: Partial<EquipmentTypeInfo>): equipment is EquipmentTypeInfo => {
  return (
    typeof equipment.name === 'string' &&
    typeof equipment.type === 'string' &&
    typeof equipment.category === 'string' &&
    typeof equipment.manufacturer === 'string' &&
    typeof equipment.model === 'string' &&
    typeof equipment.serialNumber === 'string'
  );
};

const INITIAL_DIAGNOSTIC_DATA: DiagnosticData = {
  modelNumber: '',
  serialNumber: '',
  brand: '',
  equipmentType: {
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    category: '',
  },
  images: [],
  sensorData: {
    temperature: 0,
    pressure: 0,
    humidity: 0,
    airflow: 0,
    powerConsumption: 0,
  },
  symptoms: [],
  testingInstructions: [],
  answers: {},
};

export default function DiagnosticsScreen({ navigation }: DiagnosticsScreenProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const defaultEquipment = createDefaultEquipment();
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [userComments, setUserComments] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>(INITIAL_DIAGNOSTIC_DATA);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [hasSeenGuide, setHasSeenGuide] = useState<number[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<DiagnosticHistoryItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  const defaultSystemSettings: SystemSettings = {
    ...diagnosticData.sensorData,
    fanSpeed: 0,
    mode: 'auto',
    schedule: {
      default: {
        targetTemp: 72,
        startTime: '00:00',
        endTime: '23:59'
      }
    }
  };

  useEffect(() => {
    loadHistory();
    const unsubscribe = setupNetworkListener();
    loadSavedDiagnostic();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    validateStep();
  }, [step, diagnosticData.modelNumber, diagnosticData.serialNumber, diagnosticData.brand, diagnosticData.images.length]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setShowGuide(true)}
          style={styles.helpButton}
        >
          <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!hasSeenGuide.includes(step)) {
      setShowGuide(true);
    }
  }, [step]);

  const validateStep = useCallback(() => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!diagnosticData.brand) newErrors.brand = 'Brand is required';
        if (!diagnosticData.modelNumber) newErrors.modelNumber = 'Model number is required';
        if (!diagnosticData.serialNumber) newErrors.serialNumber = 'Serial number is required';
        break;
      case 2:
        if (diagnosticData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 3:
        if (!diagnosticData.sensorData) newErrors.sensorData = 'Sensor data is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, diagnosticData]);

  const handleImageUpload = (image: ServiceImage) => {
    setDiagnosticData((prev: DiagnosticData) => ({
      ...prev,
      images: [...prev.images, image]
    }));
  };

  const handleSymptomChange = (text: string) => {
    setDiagnosticData((prev: DiagnosticData) => ({
      ...prev,
      symptoms: text.split(',').map((symptom: string) => symptom.trim())
    }));
  };

  const handleInputChange = (field: keyof DiagnosticData, value: any) => {
    setDiagnosticData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'modelNumber' || field === 'brand') {
        if (newData.modelNumber && newData.brand) {
          newData.equipmentType = AIDiagnosticService.detectEquipmentType(
            newData.modelNumber,
            newData.brand
          );
        }
      }
      
      return newData;
    });
  };

  const handleSensorDataChange = (data: Partial<SensorData>) => {
    setDiagnosticData(prev => ({
      ...prev,
      sensorData: {
        ...(prev.sensorData || {
          temperature: 0,
          pressure: 0,
          humidity: 0,
          airflow: 0,
          powerConsumption: 0,
        }),
        ...data
      }
    }));
  };

  const handleDiagnosis = async () => {
    setLoading(true);
    try {
      let imageAnalysis: ImageAnalysisResult | undefined;
      if (diagnosticData.images && diagnosticData.images.length > 0) {
        imageAnalysis = await analyzeEquipmentImages(diagnosticData.images);
      }

      const diagnosis: DiagnosticResponse = await fetchDiagnostics(
        modelNumber,
        serialNumber,
        diagnosticData.symptoms,
        defaultSystemSettings,
        diagnosticData.images.map(img => img.uri)
      );

      const optimizations: OptimizationSuggestions = await getEfficiencyOptimizations(
        modelNumber,
        serialNumber,
        defaultSystemSettings
      );

      setAnalysisResults({
        diagnosis: diagnosis.diagnosis,
        recommendations: diagnosis.recommendedActions,
        partSuggestions: diagnosis.suggestedParts,
        confidence: diagnosis.confidence,
        imageAnalysis: imageAnalysis ? {
          findings: imageAnalysis.findings,
          confidence: imageAnalysis.confidence
        } : undefined,
        optimizations: {
          potentialSavings: {
            costPerMonth: optimizations.savings.monthly,
            energyPercent: optimizations.savings.energyReductionPercent
          }
        }
      });
      setStep(4);
      setQuestions(diagnosis.questions);
      setSuggestions(diagnosis.suggestions);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    setTransitionDirection('right');
    if (!isValid) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (step === 3) {
      await handleDiagnosis();
    } else {
      await StorageService.saveDiagnosticData(diagnosticData);
      setStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setTransitionDirection('left');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleGuideClose = () => {
    setShowGuide(false);
    setHasSeenGuide(prev => [...new Set([...prev, step])]);
  };

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    Alert.alert('Error', errorMessage);
  };

  const removeImage = (uri: string, index: number): void => {
    setDiagnosticData((prev: DiagnosticData) => ({
      ...prev,
      images: prev.images.filter((img: ServiceImage, i: number) => i !== index)
    }));
  };

  const handleQuestionAnswer = async (answer: string) => {
    if (!currentQuestionId) {
      console.error('No current question ID');
      return;
    }

    try {
      const nextQuestion = await AIDiagnosticService.getNextQuestion(
        currentQuestionId,
        answer,
        diagnosticData
      );

      // Update the diagnostic data with the answer
      setDiagnosticData(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestionId]: answer
        }
      }));

      // Set the next question if available
      setCurrentQuestionId(nextQuestion?.id || null);
    } catch (error) {
      console.error('Error getting next question:', error);
      setError('Failed to process answer');
    }
  };

  const handleOrderPart = async (orderDetails: OrderDetails) => {
    try {
      setLoading(true);
      await PartOrderService.submitOrder({
        ...orderDetails,
        equipmentType: diagnosticData.equipmentType,
      });
      Alert.alert('Success', 'Part order submitted successfully');
      setShowOrderForm(false);
    } catch (error) {
      console.error('Error submitting part order:', error);
      Alert.alert('Error', 'Failed to submit part order');
    } finally {
      setLoading(false);
    }
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  };

  const loadHistory = async () => {
    try {
      const diagnosticHistory = await StorageService.getDiagnosticHistory();
      const historyWithIds: DiagnosticHistoryItem[] = diagnosticHistory.map(item => ({
        ...item,
        id: item.timestamp.toString(),
        confirmedIssue: item.confirmedIssue || 'Unknown issue',
        sensorData: item.sensorData || {
          temperature: 0,
          pressure: 0,
          humidity: 0,
          airflow: 0,
          powerConsumption: 0,
        },
        testingInstructions: item.testingInstructions || [],
        symptoms: item.symptoms || [],
        answers: item.answers || {},
      }));
      setHistory(historyWithIds);
    } catch (error) {
      console.error('Error loading diagnostic history:', error);
    }
  };

  const loadSavedDiagnostic = useCallback(async () => {
    try {
      const saved = await StorageService.getLastDiagnostic();
      if (saved) {
        const equipment = saved.equipmentType;
        if (validateEquipmentInfo(equipment)) {
          setDiagnosticData(prev => ({
            ...prev,
            ...saved,
            equipmentType: equipment
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load saved diagnostic:', error);
    }
  }, []);

  const handleDiagnosticResponse = useCallback(async (response: DiagnosticResponse) => {
    try {
      const { analysis, questions = [], suggestions = [] } = response;
      setQuestions(questions);
      setSuggestions(suggestions);
      if (analysis) {
        await handleAnalysisComplete(analysis);
      }
    } catch (error) {
      console.error('Error handling diagnostic response:', error);
      setError('Failed to process diagnostic results');
    }
  }, [handleAnalysisComplete]);

  const submitDiagnostic = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AIDiagnosticService.analyzeDiagnostic(diagnosticData);
      
      setAnalysisResults({
        diagnosis: response.diagnosis,
        confidence: response.confidence,
        suggestions: response.suggestions,
        recommendations: response.recommendedActions,
        partSuggestions: response.suggestedParts,
        optimizations: response.suggestions,
      });

      await StorageService.saveDiagnostic({
        id: Date.now().toString(),
        timestamp: Date.now(),
        confirmedIssue: response.diagnosis,
        equipmentType: diagnosticData.equipmentType,
      });

    } catch (error) {
      console.error('Error submitting diagnostic:', error);
      Alert.alert('Error', 'Failed to analyze diagnostic data');
    } finally {
      setLoading(false);
    }
  }, [diagnosticData]);

  useEffect(() => {
    loadSavedDiagnostic();
    return () => {
      // Cleanup if needed
    };
  }, [loadSavedDiagnostic]);

  useEffect(() => {
    validateStep();
  }, [validateStep, diagnosticData]);

  const handleDiagnosisComplete = useCallback(async () => {
    try {
      const historyItem: DiagnosticHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        confirmedIssue: analysisResults?.diagnosis || 'Unknown',
        equipmentType: diagnosticData.equipmentType,
      };
      
      const currentHistory = await AsyncStorage.getItem('diagnosticHistory');
      const parsedHistory: DiagnosticHistoryItem[] = currentHistory ? JSON.parse(currentHistory) : [];
      
      await AsyncStorage.setItem('diagnosticHistory', JSON.stringify([historyItem, ...parsedHistory]));
      setHistory([historyItem, ...parsedHistory]);
      
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }, [analysisResults, diagnosticData]);

  const handleSelectHistoryItem = (diagnostic: DiagnosticHistoryItem) => {
    const { timestamp, ...diagnosticState } = diagnostic;
    setDiagnosticData(diagnosticState);
    setShowHistory(false);
    setStep(4);
  };

  const loadDiagnosticHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('diagnosticHistory');
      if (history) {
        const parsedHistory = JSON.parse(history);
        // Ensure each history item has an ID
        const historyWithIds = parsedHistory.map((item: Omit<DiagnosticHistoryItem, 'id'>) => ({
          ...item,
          id: item.timestamp.toString() // Use timestamp as ID if none exists
        }));
        setHistory(historyWithIds);
      }
    } catch (error) {
      console.error('Error loading diagnostic history:', error);
    }
  };

  const saveDiagnosticToHistory = async () => {
    try {
      const newHistoryItem: DiagnosticHistoryItem = {
        ...diagnosticData,
        id: Date.now().toString(),
        timestamp: Date.now(),
        confirmedIssue: diagnosticData.confirmedIssue || 'Unknown issue'
      };

      const updatedHistory = [newHistoryItem, ...history];
      await AsyncStorage.setItem('diagnosticHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving diagnostic history:', error);
    }
  };

  const startAnalysis = async () => {
    try {
      setLoading(true);
      const aiService = AIDiagnosticService.getInstance();
      // Convert diagnosticData to DiagnosticState format
      const diagnosticState = {
        ...diagnosticData,
        equipmentType: diagnosticData.equipmentType
      };
      const analysisResults = await aiService.getDiagnosis(diagnosticState);
      // Add required optimizations field if missing
      const resultsWithOptimizations = {
        ...analysisResults,
        optimizations: []
      };
      setAnalysisResults(resultsWithOptimizations);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosticState = (state: LocalDiagnosticState): DiagnosticData => {
    return {
      ...diagnosticData,
      ...state,
      equipmentType: state.equipmentType || defaultEquipment
    };
  };

  const handleEquipmentTypeChange = (type: EquipmentTypeInfo) => {
    setDiagnosticData(prev => ({
      ...prev,
      equipmentType: type
    }));
  };

  const handleEquipmentUpdate = useCallback((equipment: Partial<EquipmentTypeInfo>) => {
    setDiagnosticData(prev => ({
      ...prev,
      equipmentType: {
        ...prev.equipmentType,
        ...equipment,
      },
    }));
  }, []);

  const updateDiagnosticData = useCallback((update: Partial<DiagnosticData>) => {
    setDiagnosticData(prev => ({
      ...prev,
      ...update
    }));
  }, []);

  const updateInventoryStatus = (status: typeof InventoryStatus[keyof typeof InventoryStatus]) => {
    setDiagnosticData(prev => ({
      ...prev,
      inventoryStatus: status
    }));
  };

  const handleAnalysisComplete = useCallback(async (analysis: AIAnalysisResult) => {
    setAnalysisResults(analysis);
    if (analysis.suggestions?.length) {
      setSuggestions(analysis.suggestions);
    }
    await saveDiagnosticState();
  }, []);

  const saveDiagnosticState = useCallback(async () => {
    try {
      await StorageService.saveDiagnosticData(diagnosticData);
      await handleDiagnosisComplete();
    } catch (error) {
      console.error('Error saving diagnostic state:', error);
      setError('Failed to save diagnostic state');
    }
  }, [diagnosticData, handleDiagnosisComplete]);

  const handleHistoryItemSelect = useCallback(async (item: DiagnosticHistoryItem) => {
    try {
      setDiagnosticData({
        ...INITIAL_DIAGNOSTIC_DATA,
        equipmentType: item.equipmentType,
        modelNumber: item.equipmentType.model,
        serialNumber: item.equipmentType.serialNumber,
        brand: item.equipmentType.manufacturer,
      });
      setShowHistory(false);
      setStep(1);
    } catch (error) {
      console.error('Error loading history item:', error);
      Alert.alert('Error', 'Failed to load diagnostic history');
    }
  }, []);

  const handleNavigation = useCallback((direction: 'next' | 'back') => {
    if (direction === 'next' && !validateStep()) {
      return;
    }

    const newStep = direction === 'next' ? step + 1 : step - 1;
    if (newStep > 0 && newStep <= DIAGNOSTIC_STEPS.length) {
      setTransitionDirection(direction === 'next' ? 'right' : 'left');
      setStep(newStep);
    }
  }, [step, validateStep]);

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <BrandSelection
              selectedBrand={diagnosticData.brand}
              onBrandSelect={(brand: string) => updateDiagnosticData({ brand })}
            />
            <ThemedInput
              label="Model Number"
              value={diagnosticData.modelNumber}
              onChangeText={(text) => updateDiagnosticData({ modelNumber: text })}
              error={errors.modelNumber}
            />
            <ThemedInput
              label="Serial Number"
              value={diagnosticData.serialNumber}
              onChangeText={(text) => updateDiagnosticData({ serialNumber: text })}
              error={errors.serialNumber}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <ImageUploader
              images={diagnosticData.images}
              onImageAdded={(image) => updateDiagnosticData({
                images: [...diagnosticData.images, image]
              })}
              onImageRemoved={(index) => updateDiagnosticData({
                images: diagnosticData.images.filter((_, i) => i !== index)
              })}
            />
            {errors.images && <ThemedText style={styles.error}>{errors.images}</ThemedText>}
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <SensorDataInput
              data={diagnosticData.sensorData}
              onDataChange={(data) => updateDiagnosticData({ sensorData: data })}
              error={errors.sensorData}
            />
          </View>
        );
      case 4:
        return renderAIAnalysis();
      default:
        return null;
    }
  };

  const renderAIAnalysis = () => (
    <View style={styles.stepContent}>
      <ThemedText style={styles.stepTitle}>AI Analysis</ThemedText>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Analyzing data...</ThemedText>
        </View>
      ) : analysisResults ? (
        <AIAnalysisResults 
          results={analysisResults}
          onPartOrder={handleOrderPart}
        />
      ) : (
        <View style={styles.startAnalysisContainer}>
          <ThemedButton
            title="Start Analysis"
            onPress={submitDiagnostic}
            disabled={!isValid}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary>
        <ScrollView style={styles.scrollView}>
          <OfflineBanner isVisible={isOffline} />
          <Card style={styles.card}>
            <StepProgress
              steps={DIAGNOSTIC_STEPS}
              currentStep={step}
              onStepPress={setStep}
            />
            <View style={styles.content}>
              {renderContent()}
            </View>
            <NavigationButtons
              step={step}
              totalSteps={DIAGNOSTIC_STEPS.length}
              onNext={() => handleNavigation('next')}
              onBack={() => handleNavigation('back')}
              isValid={isValid()}
              loading={loading}
            />
          </Card>
          {showHistory && (
            <DiagnosticHistory
              history={history}
              onSelect={handleHistoryItemSelect}
              onClose={() => setShowHistory(false)}
            />
          )}
          {showOrderForm && (
            <PartOrderForm
              equipment={diagnosticData.equipmentType}
              onSubmit={handleOrderPart}
              onClose={() => setShowOrderForm(false)}
            />
          )}
          {showGuide && (
            <DiagnosticGuide
              currentStep={step}
              onClose={() => {
                setShowGuide(false);
                setHasSeenGuide(prev => [...prev, step]);
              }}
            />
          )}
        </ScrollView>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 16,
  },
  content: {
    marginVertical: 16,
  },
  stepContent: {
    marginVertical: 16,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#007AFF',
  },
  startAnalysisContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  helpButton: {
    padding: 8,
    marginRight: 8
  }
});
