import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

export function ThemedButton({ title, onPress, disabled, style }: ThemedButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: disabled ? '#cccccc' : theme.primary },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: theme.background }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 