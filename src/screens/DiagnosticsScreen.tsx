import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { StepProgress } from '@/components/diagnostics/StepProgress';
import { fetchDiagnostics, analyzeEquipmentImages, getEfficiencyOptimizations } from '@/src/api/diagnosticsApi';
import { Ionicons } from '@expo/vector-icons';
import { SensorDataInput } from '@/components/diagnostics/SensorDataInput';
import { AIAnalysisResults } from '@/components/diagnostics/AIAnalysisResults';
import { DiagnosticGuide } from '@/components/diagnostics/DiagnosticGuide';

interface DiagnosticState {
  modelNumber: string;
  serialNumber: string;
  symptoms: string[];
  images: string[];
  sensorData?: {
    temperature: number;
    pressure: number;
    humidity: number;
    airflow: number;
    powerConsumption: number;
  };
}

const DIAGNOSTIC_STEPS = [
  'Equipment Info',
  'Symptoms',
  'Images & Data',
  'AI Analysis'
];

export default function DiagnosticsScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticState>({
    modelNumber: '',
    serialNumber: '',
    symptoms: [],
    images: [],
  });
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [hasSeenGuide, setHasSeenGuide] = useState<number[]>([]);

  useEffect(() => {
    validateStep();
  }, [step, diagnosticData]);

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
        break;
      case 2:
        if (!diagnosticData.symptoms.length) {
          newErrors.symptoms = 'At least one symptom is required';
          valid = false;
        }
        break;
      case 3:
        if (!diagnosticData.images.length && !diagnosticData.sensorData) {
          newErrors.data = 'Please provide either images or sensor data';
          valid = false;
        }
        break;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      setLoading(true);
      // Add image size validation
      const response = await fetch(imageUri);
      const blob = await response.blob();
      if (blob.size > 5000000) { // 5MB limit
        throw new Error('Image size must be less than 5MB');
      }

      setDiagnosticData(prev => ({
        ...prev,
        images: [...prev.images, imageUri]
      }));
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = (index: number) => {
    setDiagnosticData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSensorData = (data: DiagnosticState['sensorData']) => {
    setDiagnosticData(prev => ({
      ...prev,
      sensorData: data
    }));
  };

  const handleDiagnosis = async () => {
    setLoading(true);
    try {
      // First analyze any uploaded images
      let imageAnalysis;
      if (diagnosticData.images.length > 0) {
        imageAnalysis = await analyzeEquipmentImages(diagnosticData.images);
      }

      // Get the main diagnostic results
      const diagnosis = await fetchDiagnostics(
        diagnosticData.modelNumber,
        diagnosticData.serialNumber,
        diagnosticData.symptoms,
        diagnosticData.sensorData,
        diagnosticData.images
      );

      // Get efficiency optimization suggestions if we have sensor data
      let optimizations;
      if (diagnosticData.sensorData) {
        optimizations = await getEfficiencyOptimizations(
          diagnosticData.modelNumber,
          diagnosticData.serialNumber,
          {
            temperature: diagnosticData.sensorData.temperature,
            fanSpeed: 0, // Default value
            mode: 'auto',
            schedule: {} // Empty schedule
          }
        );
      }

      setResults({
        ...diagnosis,
        imageAnalysis,
        optimizations
      });
      setStep(4); // Move to results step
    } catch (error) {
      console.error('Diagnostic error:', error);
      Alert.alert(
        'Error',
        'Failed to complete diagnostic analysis. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!isValid) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (step === 3) {
      handleDiagnosis();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleGuideClose = () => {
    setShowGuide(false);
    setHasSeenGuide(prev => [...new Set([...prev, step])]);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Equipment Information</ThemedText>
            <ThemedInput
              placeholder="Model Number"
              value={diagnosticData.modelNumber}
              onChangeText={(text) => setDiagnosticData(prev => ({
                ...prev,
                modelNumber: text
              }))}
            />
            <ThemedInput
              placeholder="Serial Number"
              value={diagnosticData.serialNumber}
              onChangeText={(text) => setDiagnosticData(prev => ({
                ...prev,
                serialNumber: text
              }))}
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Symptoms</ThemedText>
            <ThemedInput
              placeholder="Enter symptoms"
              multiline
              numberOfLines={4}
              onChangeText={(text) => setDiagnosticData(prev => ({
                ...prev,
                symptoms: text.split('\n').filter(s => s.trim())
              }))}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Images & Sensor Data</ThemedText>
            <ImageUploader 
              onImageCaptured={handleImageUpload}
              disabled={loading}
            />
            <View style={styles.imagePreviewContainer}>
              {diagnosticData.images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewWrapper}>
                  <Image 
                    source={{ uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleImageDelete(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <SensorDataInput
              onDataChange={handleSensorData}
              currentData={diagnosticData.sensorData || {}}
            />
            {errors.data && (
              <ThemedText style={styles.errorText}>{errors.data}</ThemedText>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>AI Analysis Results</ThemedText>
            {results && <AIAnalysisResults results={results} />}
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
    <ThemedView style={styles.container}>
      {renderProgressIndicator()}
      <StepProgress currentStep={step} steps={DIAGNOSTIC_STEPS} />
      <ScrollView style={styles.scrollView}>
        {renderStep()}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <ThemedButton
            title="Back"
            onPress={() => setStep(prev => prev - 1)}
            style={styles.button}
            disabled={loading}
          />
        )}
        <ThemedButton
          title={step === 3 ? "Analyze" : step === 4 ? "Start Over" : "Next"}
          onPress={handleNextStep}
          style={[styles.button, styles.primaryButton]}
          loading={loading}
          disabled={!isValid || loading}
        />
      </View>

      <DiagnosticGuide
        visible={showGuide}
        onClose={handleGuideClose}
        currentStep={step}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>
            Analyzing your HVAC system...
          </ThemedText>
        </View>
      )}
    </ThemedView>
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
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
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
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  imagePreviewWrapper: {
    position: 'relative',
    margin: 5,
  },
  deleteButton: {
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
});
