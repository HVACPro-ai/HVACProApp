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
import { AIAnalysisResults } from '../components/diagnostics/AIAnalysisResults';
import { DiagnosticGuide } from '../components/diagnostics/DiagnosticGuide';
import { fetchDiagnostics, analyzeEquipmentImages, getEfficiencyOptimizations } from '../api/diagnosticsApi';
import { Ionicons } from '@expo/vector-icons';
import type { ServiceImage, DiagnosticState, AIQuestion, OrderDetails, SystemSettings, SensorData } from '../types';
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
import { 
  DiagnosticHistoryItem,
  TestingInstruction,
  EquipmentTypeInfo
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiagnosticResponse, OptimizationSuggestions, ImageAnalysisResult } from '../api/diagnosticsApi';
import VisualAid from '../../components/VisualAid';

const DIAGNOSTIC_STEPS = [
  'Equipment Info',
  'Symptoms',
  'Images & Data',
  'AI Analysis'
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
}

interface AIAnalysisProps {
  results: AIAnalysisResult;
  onPartOrder: (partId: string) => void;
}

interface DiagnosticData extends DiagnosticState {
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

  const createDiagnosticData = (partial: Partial<DiagnosticData>): DiagnosticData => {
    const equipment: EquipmentTypeInfo = {
      id: '1',
      name: 'AC Unit',
      category: 'Cooling',
      // other properties...
    };

    return {
      modelNumber: '',
      serialNumber: '',
      brand: '',
      equipmentType: equipment,
      images: [] as ServiceImage[],  // Explicitly type as non-undefined array
      sensorData: {
        temperature: 0,
        pressure: 0,
        humidity: 0,
        airflow: 0,
        powerConsumption: 0
      },
      symptoms: [],
      testingInstructions: [],
      answers: {},
      ...partial,
      equipmentType: equipment  // Ensure equipment is always set
    };
  };

  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>(createDiagnosticData({}));
  const [results, setResults] = useState<AIAnalysisResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    let valid = true;

    switch (step) {
      case 1:
        if (!diagnosticData.modelNumber) {
          newErrors.modelNumber = 'Model number is required';
          valid = false;
        }
        if (!diagnosticData.serialNumber) {
          newErrors.serialNumber = 'Serial number is required';
          valid = false;
        }
        if (!diagnosticData.brand) {
          newErrors.brand = 'Brand is required';
          valid = false;
        }
        break;
      case 2:
        if (!diagnosticData.images.length) {
          newErrors.images = 'At least one image is required';
          valid = false;
        }
        break;
      case 3:
        if (!diagnosticData.sensorData) {
          newErrors.sensorData = 'Sensor data is required';
          valid = false;
        }
        break;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

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

      setResults({
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
      const { orderId } = await PartOrderService.submitOrder(
        diagnosticData.inventoryStatus?.partNumber || '',
        orderDetails
      );
      setCurrentOrderId(orderId);
      setShowOrderForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit order. Please try again.');
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

  const loadSavedDiagnostic = async () => {
    const savedData = await StorageService.getDiagnosticData();
    if (savedData) {
      // Ensure all required fields are present before setting state
      const validatedData: DiagnosticData = {
        ...savedData,
        equipmentType: savedData.equipmentType || {
          name: '',
          manufacturer: '',
          model: '',
          serialNumber: ''
        }
      };
      setDiagnosticData(validatedData);
    }
  };

  const handleDiagnosisComplete = async () => {
    try {
      await StorageService.addToDiagnosticHistory(diagnosticData);
      await StorageService.clearDiagnosticData();
      loadHistory();
    } catch (error) {
      console.error('Error saving diagnostic history:', error);
    }
  };

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
      setResults(resultsWithOptimizations);
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
    const updatedEquipment: EquipmentTypeInfo = {
      id: equipment.id || defaultEquipment.id,
      name: equipment.name || defaultEquipment.name,
      category: equipment.category || defaultEquipment.category,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      serialNumber: equipment.serialNumber
    };
    
    updateDiagnosticData({
      equipmentType: updatedEquipment
    });
  }, [updateDiagnosticData]);

  const updateDiagnosticData = useCallback((update: Partial<DiagnosticData>) => {
    setDiagnosticData(prev => createDiagnosticData({
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

  function renderEquipmentInfo() {
    return (
      <View style={styles.stepContent}>
        <View style={styles.formContainer}>
          <ThemedText style={styles.stepTitle}>Equipment Info</ThemedText>
          <View style={styles.progressContainer}>
            <ThemedText style={styles.stepIndicator}>Step 1 of 4</ThemedText>
          </View>
          
          <ThemedInput
            label="Model Number"
            value={modelNumber}
            onChangeText={setModelNumber}
            placeholder="Enter model number"
            error={errors.modelNumber}
          />
          
          <ThemedInput
            label="Serial Number"
            value={serialNumber}
            onChangeText={setSerialNumber}
            placeholder="Enter serial number"
            error={errors.serialNumber}
          />
          
          <ThemedInput
            label="Error Code"
            value={errorCode}
            onChangeText={setErrorCode}
            placeholder="Enter error code"
            error={errors.errorCode}
          />
          
          <View style={styles.brandSection}>
            <ThemedText style={styles.label}>Brand</ThemedText>
            <BrandSelection
              selectedBrand={diagnosticData.brand}
              onSelect={(brand) => handleInputChange('brand', brand)}
              onCustomBrand={(brand) => handleInputChange('brand', brand)}
              error={errors.brand}
            />
          </View>
        </View>
      </View>
    );
  }

  const renderSymptoms = () => (
    <View style={styles.stepContainer}>
      <ScrollView style={styles.scrollContent}>
        <ThemedText style={styles.stepTitle}>Symptoms</ThemedText>
        <ThemedInput
          value={diagnosticData.symptoms.join(', ')}
          placeholder="Enter symptoms"
          multiline
          numberOfLines={4}
          onChangeText={handleSymptomChange}
          style={styles.symptomsInput}
        />
      </ScrollView>
    </View>
  );

  const renderBasicDiagnostics = () => (
    <View style={styles.stepContainer}>
      <ScrollView style={styles.scrollContent}>
        <ThemedText style={styles.stepTitle}>Basic Diagnostics</ThemedText>
        <View style={styles.advancedFeaturesPrompt}>
          <ThemedText>Would you like to use advanced diagnostic features?</ThemedText>
          <View style={styles.buttonRow}>
            <ThemedButton
              title="Yes, use advanced features"
              onPress={() => setShowAdvancedFeatures(true)}
              style={styles.button}
            />
            <ThemedButton
              title="No, continue with basic"
              onPress={handleNextStep}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderAdvancedDiagnostics = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Advanced Diagnostics</ThemedText>
      
      <View style={styles.featureSection}>
        <ThemedText style={styles.sectionTitle}>Images</ThemedText>
        <ImageUploader 
          images={diagnosticData.images}
          onImageAdded={(image: ServiceImage) => 
            handleInputChange('images', [...diagnosticData.images, image])
          }
          onImageRemoved={(index: number) => {
            const newImages = [...diagnosticData.images];
            newImages.splice(index, 1);
            handleInputChange('images', newImages);
          }}
        />
        {diagnosticData.images && diagnosticData.images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {diagnosticData.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(image.uri, index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.featureSection}>
        <ThemedText style={styles.sectionTitle}>Sensor Readings</ThemedText>
        <SensorDataInput
          data={diagnosticData.sensorData}
          onDataChange={(data: Partial<SensorData>) => 
            handleInputChange('sensorData', data)
          }
        />
      </View>
    </View>
  );

  const renderResults = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>AI Analysis Results</ThemedText>
      {results && <AIAnalysisResults results={results} onPartOrder={handleOrderPart} />}
    </View>
  );

  function renderImagesAndData() {
    return (
      <View style={styles.stepContent}>
        <View style={styles.formContainer}>
          <ThemedText style={styles.stepTitle}>Images & Data</ThemedText>
          <View style={styles.progressContainer}>
            <ThemedText style={styles.stepIndicator}>Step 3 of 4</ThemedText>
          </View>
          
          <ImageUploader
            images={diagnosticData.images}
            onImageAdded={(image: ServiceImage) => 
              handleInputChange('images', [...diagnosticData.images, image])
            }
            onImageRemoved={(index: number) => {
              const newImages = [...diagnosticData.images];
              newImages.splice(index, 1);
              handleInputChange('images', newImages);
            }}
          />

          <SensorDataInput
            data={diagnosticData.sensorData}
            onDataChange={(data: Partial<SensorData>) => 
              handleInputChange('sensorData', data)
            }
          />
        </View>
      </View>
    );
  }

  function renderAIAnalysis() {
    return (
      <View style={styles.stepContent}>
        <View style={styles.formContainer}>
          <ThemedText style={styles.stepTitle}>AI Analysis</ThemedText>
          <View style={styles.progressContainer}>
            <ThemedText style={styles.stepIndicator}>Step 4 of 4</ThemedText>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Analyzing data...</ThemedText>
            </View>
          ) : results ? (
            <AIAnalysisResults 
              results={results}
              onPartOrder={handleOrderPart}
            />
          ) : (
            <View style={styles.startAnalysisContainer}>
              <ThemedButton
                title="Start Analysis"
                onPress={startAnalysis}
                disabled={!isValid}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            {renderEquipmentInfo()}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            {renderSymptoms()}
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            {renderImagesAndData()}
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            {renderAIAnalysis()}
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>AI Question</ThemedText>
            {diagnosticData.currentQuestion && (
              <AIQuestionPrompt
                question={diagnosticData.currentQuestion}
                onAnswer={handleQuestionAnswer}
              />
            )}
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Testing Instructions</ThemedText>
            {diagnosticData.testingInstructions && (
              <TestingInstructions
                instructions={diagnosticData.testingInstructions}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <ThemedText style={styles.progressText}>
        Step {step} of {DIAGNOSTIC_STEPS.length}
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        {DIAGNOSTIC_STEPS[step - 1]}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isOffline && <OfflineBanner />}
        
        <View style={styles.mainContent}>
          {renderStep()}
        </View>

        <View style={styles.footer}>
          <ThemedButton
            title="Next"
            onPress={handleNextStep}
            disabled={!isValid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    flex: 1,
    width: '100%',
  },
  stepContent: {
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#666',
  },
  brandSection: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  symptomsInput: {
    height: 120,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  advancedFeaturesPrompt: {
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confidenceBar: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  confidenceFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#34C759',
    borderRadius: 10,
  },
  confidenceText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  issueText: {
    marginLeft: 10,
    flex: 1,
  },
  savingsText: {
    fontSize: 16,
    color: '#34C759',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  helpButton: {
    marginRight: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
  },
  featureSection: {
    marginBottom: 24,
  },
  startAnalysisContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
