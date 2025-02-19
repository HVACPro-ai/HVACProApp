import React from 'react';
import { View, ViewProps } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export function ThemedView(props: ViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      {...props}
      style={[
        props.style,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    />
  );
} 