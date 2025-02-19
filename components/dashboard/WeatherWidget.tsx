import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Weather } from '@/src/hooks/useDashboardData';

interface Props {
  weather: Weather | null;
}

export function WeatherWidget({ weather }: Props) {
  if (!weather) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.temperature}>
        {weather.temperature}°F
      </ThemedText>
      <ThemedText style={styles.condition}>
        {weather.condition}
      </ThemedText>
      <ThemedText style={styles.highLow}>
        H: {weather.high}° L: {weather.low}°
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 18,
    color: '#666',
    marginVertical: 5,
  },
  highLow: {
    fontSize: 16,
    color: '#666',
  },
}); 