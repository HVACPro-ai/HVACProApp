import React from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, TextStyle, ViewStyle, TextInputProps, TouchableOpacityProps } from 'react-native';

interface ThemedTextProps {
  style?: TextStyle;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.text, style]} {...props}>{children}</Text>
);

interface ThemedInputProps extends TextInputProps {
  style?: ViewStyle;
  label?: string;
  error?: string;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({ style, label, error, ...props }) => (
  <View>
    {label && <ThemedText style={styles.label}>{label}</ThemedText>}
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor="#666"
      {...props}
    />
    {error && <ThemedText style={styles.error}>{error}</ThemedText>}
  </View>
);

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({ title, style, disabled, ...props }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled, style]}
    disabled={disabled}
    {...props}
  >
    <ThemedText style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
      {title}
    </ThemedText>
  </TouchableOpacity>
);

export const ThemedView: React.FC<{ style?: ViewStyle; children: React.ReactNode }> = ({ style, children }) => (
  <View style={[styles.view, style]}>{children}</View>
);

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#666',
  },
  view: {
    backgroundColor: '#fff',
  },
}); 