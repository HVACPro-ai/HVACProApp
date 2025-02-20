import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedButton } from '../ThemedComponents';

interface Props {
  currentStep: number;
  onClose: () => void;
}

const STEP_GUIDES = {
  1: 'Select the equipment type and enter basic information.',
  2: 'Take clear photos of the equipment and any visible issues.',
  3: 'Enter sensor readings if available.',
  4: 'Review AI analysis and recommendations.',
};

export const DiagnosticGuide: React.FC<Props> = ({ currentStep, onClose }) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Step {currentStep} Guide</ThemedText>
      <ThemedText style={styles.content}>
        {STEP_GUIDES[currentStep as keyof typeof STEP_GUIDES]}
      </ThemedText>
      <ThemedButton
        title="Got it"
        onPress={onClose}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    alignSelf: 'flex-end',
  },
}); 