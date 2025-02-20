import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedButton } from './ThemedButton';

interface Props {
  step: number;
  isValid: boolean;
  onNext: () => void;
  onPrevious: () => void;
  style?: ViewStyle;
}

export function NavigationButtons({ step, isValid, onNext, onPrevious, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {step > 1 && (
        <ThemedButton
          title="Previous"
          onPress={onPrevious}
          style={styles.button}
        />
      )}
      <ThemedButton
        title="Next"
        onPress={onNext}
        disabled={!isValid}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    minWidth: 120,
  },
}); 