import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';

interface Props {
  currentStep: number;
  totalSteps: number;
  title: string;
  style?: ViewStyle;
}

export function DiagnosticProgress({ currentStep, totalSteps, title, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
      <ThemedText style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
}); 