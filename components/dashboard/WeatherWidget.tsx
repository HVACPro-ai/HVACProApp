import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Weather } from '@/src/hooks/useDashboardData';

interface Props {
  weather: Weather | null;
}

export function WeatherWidget({ weather }: Props) {
  if (!weather) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Ionicons 
          name={getWeatherIcon(weather.icon)} 
          size={24} 
          color="#007AFF" 
        />
        <ThemedText style={styles.description}>
          {weather.description}
        </ThemedText>
        <ThemedText style={styles.temperature}>
          {weather.temperature}°F
        </ThemedText>
        <ThemedText style={styles.details}>
          Feels like {weather.feelsLike}°F
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const getWeatherIcon = (iconCode: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    '01d': 'sunny',
    '01n': 'moon',
    '02d': 'partly-sunny',
    '02n': 'cloudy-night',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rainy',
    '09n': 'rainy',
    '10d': 'rainy',
    '10n': 'rainy',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'water',
    '50n': 'water',
  };

  return iconMap[iconCode] || 'help-circle';
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },
  content: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  temperature: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 5,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
}); 