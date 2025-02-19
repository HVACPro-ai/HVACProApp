import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  loading?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  style,
  disabled,
  loading
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, disabled && styles.disabled]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ThemedText style={styles.text}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 