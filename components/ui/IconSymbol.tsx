import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export type IconSymbolProps = {
  name: string;
  color?: string;
  size?: number;
};

export function IconSymbol({ name, color, size = 24 }: IconSymbolProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor = color ?? Colors[colorScheme].text;

  return (
    <Text style={[styles.icon, { fontSize: size, color: iconColor }]}>
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'System',
  },
}); 