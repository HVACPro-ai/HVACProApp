import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  currentStep: number;
  steps: string[];
}

export function StepProgress({ currentStep, steps }: Props) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.circle,
            index + 1 === currentStep && styles.activeCircle,
            index + 1 < currentStep && styles.completedCircle
          ]}>
            {index + 1 < currentStep ? (
              <Ionicons name="checkmark" size={16} color="#fff" />
            ) : (
              <ThemedText style={[
                styles.stepNumber,
                index + 1 === currentStep && styles.activeText
              ]}>
                {index + 1}
              </ThemedText>
            )}
          </View>
          <ThemedText style={[
            styles.stepText,
            index + 1 === currentStep && styles.activeText
          ]}>
            {step}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeCircle: {
    backgroundColor: '#007AFF',
  },
  completedCircle: {
    backgroundColor: '#34C759',
  },
  stepNumber: {
    color: '#666',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
  },
  activeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
}); 