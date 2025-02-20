import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '../ThemedText';

interface Props {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export function DiagnosticProgress({ currentStep, totalSteps, title }: Props) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.stepCount}>
          Step {currentStep} of {totalSteps}
        </ThemedText>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepCount: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
}); 