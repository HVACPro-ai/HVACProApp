import React from 'react';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabBarBackground() {
  const backgroundColor = useThemeColor({}, 'background');
  
  return (
    <View style={{ flex: 1, backgroundColor }} />
  );
} 