import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

export interface ThemedInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: any;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({ 
  label,
  error,
  style,
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText style={styles.label}>{label}</ThemedText>
      )}
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#000',
            backgroundColor: isDark ? '#333' : '#fff',
            borderColor: isDark ? '#666' : '#ccc',
          },
          error && styles.inputError
        ]}
        placeholderTextColor={isDark ? '#999' : '#666'}
      />
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
}); 