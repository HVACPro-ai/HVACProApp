import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

interface ThemedInputProps extends TextInputProps {
  error?: string;
}

export function ThemedInput({ error, style, ...props }: ThemedInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={style}>
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
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
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