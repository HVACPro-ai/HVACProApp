import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedButton } from '../ThemedComponents';

interface Props {
  step: number;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
  loading: boolean;
}

export const NavigationButtons: React.FC<Props> = ({
  step,
  onNext,
  onBack,
  isValid,
  loading
}) => {
  return (
    <View style={styles.container}>
      <ThemedButton
        title="Back"
        onPress={onBack}
        disabled={step === 1 || loading}
        style={styles.button}
      />
      <ThemedButton
        title={loading ? 'Loading...' : 'Next'}
        onPress={onNext}
        disabled={!isValid || loading}
        style={[styles.button, styles.primaryButton]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
}); 