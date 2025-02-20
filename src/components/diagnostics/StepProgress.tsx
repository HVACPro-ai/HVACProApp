import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedComponents';

interface Props {
  step: number;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
  loading: boolean;
}

const TOTAL_STEPS = 4;

export const StepProgress: React.FC<Props> = ({ step }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.step,
              index < step && styles.completed,
              index === step - 1 && styles.current,
            ]}
          />
        ))}
      </View>
      <ThemedText style={styles.stepText}>
        Step {step} of {TOTAL_STEPS}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  step: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  completed: {
    backgroundColor: '#007AFF',
  },
  current: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    textAlign: 'center',
    color: '#666',
  },
}); 