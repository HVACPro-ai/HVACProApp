import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  ThemedView,
  ThemedText,
  ThemedInput,
  ThemedButton
} from '../components';
import { ImageUploader } from '../components/dashboard/ImageUploader';
import { StepProgress } from '../components/diagnostics/StepProgress';
import { SensorDataInput, SensorData } from '../components/diagnostics/SensorDataInput';
import { AIAnalysisResults } from '../components/diagnostics/AIAnalysisResults';
import { DiagnosticGuide } from '../components/diagnostics/DiagnosticGuide';
import { fetchDiagnostics, analyzeEquipmentImages, getEfficiencyOptimizations } from '../api/diagnosticsApi';
import { Ionicons } from '@expo/vector-icons';
import type { ServiceImage, DiagnosticState, AIQuestion, OrderDetails, SystemSettings } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrandSelection } from '../components/diagnostics/BrandSelection';
import { AIQuestionPrompt } from '../components/diagnostics/AIQuestionPrompt';
import { TestingInstructions } from '../components/diagnostics/TestingInstructions';
import { InventoryStatus } from '../components/diagnostics/InventoryStatus';
import { AIDiagnosticService } from '../services/aiDiagnosticService';
import { DiagnosticProgress } from '../components/diagnostics/DiagnosticProgress';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PartOrderForm } from '../components/diagnostics/PartOrderForm';
import { PartOrderService } from '../services/partOrderService';
import { AnimatedStepTransition } from '../components/diagnostics/AnimatedStepTransition';
import { OrderTracking } from '../components/diagnostics/OrderTracking';
import { StorageService } from '../services/storageService';
import { DiagnosticHistory } from '../components/diagnostics/DiagnosticHistory';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { 
  DiagnosticHistoryItem,
  TestingInstruction
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DIAGNOSTIC_STEPS = [
  'Equipment Info',
  'Symptoms',
  'Images & Data',
  'AI Analysis'
];

interface DiagnosticsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function DiagnosticsScreen({ navigation }: DiagnosticsScreenProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticState>({
    modelNumber: '',
    serialNumber: '',
    brand: '',
    symptoms: [],
    images: [],
    testingInstructions: [],
    answers: {},
  });
  const [results, setResults] = useState<any>(null);
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

  useEffect(() => {
    loadHistory();
    const unsubscribe = setupNetworkListener();
    loadSavedDiagnostic();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    validateStep();
  }, [step, diagnosticData.modelNumber, diagnosticData.serialNumber, diagnosticData.brand, diagnosticData.symptoms.length]);

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
        if (!diagnosticData.symptoms.length) {
          newErrors.symptoms = 'At least one symptom is required';
          valid = false;
        }
        break;
      case 3:
        if (!diagnosticData.images && !diagnosticData.sensorData) {
          newErrors.data = 'Please provide either images or sensor data';
          valid = false;
        }
        break;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleImageUpload = (image: ServiceImage) => {
    setDiagnosticData((prev: DiagnosticState) => ({
      ...prev,
      images: [...(prev.images || []), image]
    }));
  };

  const handleSymptomChange = (text: string) => {
    setDiagnosticData((prev: DiagnosticState) => ({
      ...prev,
      symptoms: text.split(',').map((symptom: string) => symptom.trim())
    }));
  };

  const handleInputChange = (field: keyof DiagnosticState, value: any) => {
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
      let imageAnalysis;
      if (diagnosticData.images && diagnosticData.images.length > 0) {
        imageAnalysis = await analyzeEquipmentImages(diagnosticData.images);
      }

      const diagnosis = await fetchDiagnostics(
        diagnosticData.modelNumber,
        diagnosticData.serialNumber,
        diagnosticData.symptoms,
        diagnosticData.sensorData,
        diagnosticData.images?.map(img => img.uri) || []
      );

      let optimizations;
      if (diagnosticData.sensorData) {
        const systemSettings: SystemSettings = {
          ...diagnosticData.sensorData,
          fanSpeed: 0,
          mode: 'auto' as const,
          schedule: {
            default: {
              targetTemp: 72,
              startTime: '00:00',
              endTime: '23:59'
            }
          }
        };
        
        optimizations = await getEfficiencyOptimizations(
          diagnosticData.modelNumber,
          diagnosticData.serialNumber,
          systemSettings
        );
      }

      setResults({
        ...diagnosis,
        imageAnalysis,
        optimizations
      });
      setStep(4);
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
    setDiagnosticData((prev: DiagnosticState) => ({
      ...prev,
      images: (prev.images || []).filter((img: ServiceImage, i: number) => i !== index)
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
      setDiagnosticData(savedData);
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

  function renderEquipmentInfo() {
    return (
      <View style={styles.stepContainer}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.inputContainer}>
            <ThemedInput
              label="Model Number"
              value={diagnosticData.modelNumber}
              onChangeText={(text) => handleInputChange('modelNumber', text)}
              placeholder="Enter model number"
              style={styles.inputField}
            />
            
            <ThemedInput
              label="Serial Number"
              value={diagnosticData.serialNumber}
              onChangeText={(text) => handleInputChange('serialNumber', text)}
              placeholder="Enter serial number"
              style={styles.inputField}
            />
            
            <View style={styles.brandContainer}>
              <ThemedText style={styles.label}>Brand</ThemedText>
              <BrandSelection
                selectedBrand={diagnosticData.brand}
                onSelect={(brand) => handleInputChange('brand', brand)}
                onCustomBrand={(brand) => handleInputChange('brand', brand)}
              />
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Next"
            onPress={handleNextStep}
            disabled={!isValid}
          />
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
          onImageCaptured={handleImageUpload}
          disabled={loading}
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
          currentData={diagnosticData.sensorData || {
            temperature: 0,
            pressure: 0,
            humidity: 0,
            airflow: 0,
            powerConsumption: 0,
          }}
          onDataChange={handleSensorDataChange}
        />
      </View>
    </View>
  );

  const renderResults = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>AI Analysis Results</ThemedText>
      {results && <AIAnalysisResults results={results} />}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderEquipmentInfo();
      case 2:
        return renderSymptoms();
      case 3:
        return showAdvancedFeatures ? renderAdvancedDiagnostics() : renderBasicDiagnostics();
      case 4:
        return renderResults();
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
    <ErrorBoundary>
      <ThemedView style={styles.container}>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <ThemedText style={styles.offlineText}>
              You are offline. Changes will be saved locally.
            </ThemedText>
          </View>
        )}

        <DiagnosticProgress
          currentStep={step}
          totalSteps={DIAGNOSTIC_STEPS.length}
          title={DIAGNOSTIC_STEPS[step - 1]}
        />
        
        <AnimatedStepTransition
          visible={true}
          direction={transitionDirection}
        >
          {currentOrderId ? (
            <OrderTracking
              orderId={currentOrderId}
              onClose={() => setCurrentOrderId(null)}
            />
          ) : showOrderForm ? (
            <PartOrderForm
              partNumber={diagnosticData.inventoryStatus?.partNumber || ''}
              partName={diagnosticData.inventoryStatus?.partName || ''}
              onSubmit={handleOrderPart}
              onCancel={() => setShowOrderForm(false)}
            />
          ) : showHistory ? (
            <DiagnosticHistory
              history={history}
              onSelectDiagnostic={handleSelectHistoryItem}
            />
          ) : (
            renderStep()
          )}
        </AnimatedStepTransition>

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <ThemedButton
              title="Previous"
              onPress={handlePreviousStep}
              style={styles.button}
              disabled={loading}
            />
          )}
          <ThemedButton
            title={step === 3 ? "Analyze" : step === 4 ? "Start Over" : "Next"}
            onPress={handleNextStep}
            style={styles.button}
            loading={loading}
            disabled={!isValid || loading}
          />
        </View>

        <DiagnosticGuide
          visible={showGuide}
          onClose={handleGuideClose}
          currentStep={step}
        />
      </ThemedView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80, // Add padding for button
  },
  inputContainer: {
    paddingTop: 16,
    paddingBottom: 80, // Space for button
  },
  inputField: {
    marginBottom: 24,
  },
  brandContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 16,
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
    gap: 16,
  },
  button: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
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
  progressContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  content: {
    flex: 1,
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
  offlineBanner: {
    backgroundColor: '#FFD700',
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: '#000',
  },
  featureSection: {
    marginBottom: 24,
  },
});
