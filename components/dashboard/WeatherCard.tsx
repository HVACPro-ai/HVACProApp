import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getWeather, WeatherData } from '@/src/api/weatherApi';

export function WeatherCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required to show weather');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      
      // Fetch weather data
      const weatherData = await getWeather(
        location.coords.latitude,
        location.coords.longitude
      );
      
      setWeather(weatherData);
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string): keyof typeof Ionicons.glyphMap => {
    // Map OpenWeatherMap icon codes to Ionicons
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

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.error}>{error}</ThemedText>
        <ThemedText 
          style={styles.retry}
          onPress={loadWeatherData}
        >
          Tap to retry
        </ThemedText>
      </ThemedView>
    );
  }

  if (!weather) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.location}>{weather.location}</ThemedText>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadWeatherData}
        >
          <Ionicons name="refresh" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Ionicons 
            name={getWeatherIcon(weather.icon)}
            size={48}
            color="#007AFF"
          />
          <ThemedText style={styles.temperature}>
            {weather.temperature}°F
          </ThemedText>
        </View>

        <ThemedText style={styles.description}>
          {weather.description}
        </ThemedText>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="thermometer" size={20} color="#666" />
            <ThemedText style={styles.detailText}>
              Feels like {weather.feelsLike}°F
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="water" size={20} color="#666" />
            <ThemedText style={styles.detailText}>
              Humidity {weather.humidity}%
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="speedometer" size={20} color="#666" />
            <ThemedText style={styles.detailText}>
              Wind {weather.windSpeed} mph
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 5,
  },
  content: {
    alignItems: 'center',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  details: {
    width: '100%',
    marginTop: 15,
    gap: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  retry: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
}); 