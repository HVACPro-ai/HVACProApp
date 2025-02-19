import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { fetchDiagnostics } from '@/src/api/diagnosticsApi';

type DiagnosticStep = 'initial' | 'details' | 'symptoms' | 'results';

export default function Diagnostics() {
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>('initial');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    switch (currentStep) {
      case 'initial':
        setCurrentStep('details');
        break;
      case 'details':
        if (!modelNumber || !serialNumber) {
          Alert.alert('Missing Information', 'Please enter both model and serial numbers.');
          return;
        }
        setCurrentStep('symptoms');
        break;
      case 'symptoms':
        if (!symptoms) {
          Alert.alert('Missing Information', 'Please describe the symptoms.');
          return;
        }
        handleDiagnosis();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('initial');
        break;
      case 'symptoms':
        setCurrentStep('details');
        break;
      case 'results':
        setCurrentStep('symptoms');
        setSuggestions([]);
        break;
    }
  };

  const handleDiagnosis = async () => {
    setLoading(true);
    try {
      const result = await fetchDiagnostics(modelNumber, serialNumber, symptoms);
      setSuggestions(result.suggestions);
      setCurrentStep('results');
    } catch (error) {
      Alert.alert('Error', 'Failed to get diagnostic suggestions. Please try again.');
      console.error('Error getting diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('initial');
    setModelNumber('');
    setSerialNumber('');
    setSymptoms('');
    setSuggestions([]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'initial':
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.title}>HVAC Diagnostic Tool</ThemedText>
            <ThemedText style={styles.description}>
              This tool will help you diagnose HVAC issues by:
            </ThemedText>
            <View style={styles.bulletPoints}>
              <ThemedText style={styles.bullet}>• Analyzing equipment details</ThemedText>
              <ThemedText style={styles.bullet}>• Evaluating symptoms</ThemedText>
              <ThemedText style={styles.bullet}>• Providing targeted solutions</ThemedText>
            </View>
            <ThemedButton title="Start Diagnosis" onPress={handleNext} />
          </View>
        );

      case 'details':
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Equipment Details</ThemedText>
            <ThemedInput
              placeholder="Model Number"
              value={modelNumber}
              onChangeText={setModelNumber}
              style={styles.input}
            />
            <ThemedInput
              placeholder="Serial Number"
              value={serialNumber}
              onChangeText={setSerialNumber}
              style={styles.input}
            />
            <View style={styles.buttonRow}>
              <ThemedButton title="Back" onPress={handleBack} />
              <ThemedButton title="Next" onPress={handleNext} />
            </View>
          </View>
        );

      case 'symptoms':
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Describe Symptoms</ThemedText>
            <ThemedInput
              placeholder="What issues are you experiencing?"
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            <View style={styles.buttonRow}>
              <ThemedButton title="Back" onPress={handleBack} />
              <ThemedButton 
                title={loading ? "Analyzing..." : "Get Diagnosis"} 
                onPress={handleNext}
                disabled={loading}
              />
            </View>
          </View>
        );

      case 'results':
        return (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Diagnostic Results</ThemedText>
            <View style={styles.resultsContainer}>
              {suggestions.map((suggestion, index) => (
                <ThemedText key={index} style={styles.suggestion}>
                  • {suggestion}
                </ThemedText>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <ThemedButton title="Back" onPress={handleBack} />
              <ThemedButton title="Start Over" onPress={handleStartOver} />
            </View>
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  bulletPoints: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  bullet: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 10,
  },
});