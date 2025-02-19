import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedInput } from '../../components/ThemedInput';
import { Ionicons } from '@expo/vector-icons';

interface SensorData {
  temperature: number;
  pressure: number;
  humidity: number;
  airflow: number;
  powerConsumption: number;
  noiseLevel?: number;
}

interface Props {
  onDataChange: (data: Partial<SensorData>) => void;
  currentData: Partial<SensorData>;
}

interface ValidationErrors {
  [key: string]: string;
}

export function SensorDataInput({ onDataChange, currentData }: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (key: string, value: number): string => {
    switch (key) {
      case 'temperature':
        return (value < -20 || value > 120) ? 'Temperature must be between -20°F and 120°F' : '';
      case 'pressure':
        return (value < 0 || value > 500) ? 'Pressure must be between 0 and 500 PSI' : '';
      case 'humidity':
        return (value < 0 || value > 100) ? 'Humidity must be between 0% and 100%' : '';
      case 'airflow':
        return (value < 0 || value > 2000) ? 'Airflow must be between 0 and 2000 CFM' : '';
      case 'powerConsumption':
        return (value < 0 || value > 50) ? 'Power must be between 0 and 50 kW' : '';
      default:
        return '';
    }
  };

  const handleChange = (key: keyof SensorData, value: string) => {
    const numValue = parseFloat(value) || 0;
    const error = validateField(key, numValue);
    
    setErrors(prev => ({
      ...prev,
      [key]: error
    }));

    if (!error) {
      onDataChange({
        ...currentData,
        [key]: numValue,
      } as SensorData);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Sensor Readings</ThemedText>
      
      <View style={styles.sensorGrid}>
        <View style={styles.sensorItem}>
          <Ionicons name="thermometer-outline" size={24} color="#007AFF" />
          <ThemedInput
            label="Temperature (°F)"
            keyboardType="numeric"
            value={currentData.temperature?.toString()}
            onChangeText={(value) => handleChange('temperature', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.sensorItem}>
          <Ionicons name="speedometer-outline" size={24} color="#007AFF" />
          <ThemedInput
            label="Pressure (PSI)"
            keyboardType="numeric"
            value={currentData.pressure?.toString()}
            onChangeText={(value) => handleChange('pressure', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.sensorItem}>
          <Ionicons name="water-outline" size={24} color="#007AFF" />
          <ThemedInput
            label="Humidity (%)"
            keyboardType="numeric"
            value={currentData.humidity?.toString()}
            onChangeText={(value) => handleChange('humidity', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.sensorItem}>
          <Ionicons name="leaf-outline" size={24} color="#007AFF" />
          <ThemedInput
            label="Airflow (CFM)"
            keyboardType="numeric"
            value={currentData.airflow?.toString()}
            onChangeText={(value) => handleChange('airflow', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.sensorItem}>
          <Ionicons name="flash-outline" size={24} color="#007AFF" />
          <ThemedInput
            label="Power (kW)"
            keyboardType="numeric"
            value={currentData.powerConsumption?.toString()}
            onChangeText={(value) => handleChange('powerConsumption', value)}
            style={styles.input}
          />
        </View>

        <View style={styles.sensorItem}>
          <Ionicons name="volume-medium-outline" size={24} color="#007AFF" />
          <ThemedInput
            label="Noise (dB)"
            keyboardType="numeric"
            value={currentData.noiseLevel?.toString()}
            onChangeText={(value) => handleChange('noiseLevel', value)}
            style={styles.input}
          />
        </View>
      </View>
      {Object.entries(errors).map(([key, error]) => (
        error ? (
          <ThemedText key={key} style={styles.errorText}>{error}</ThemedText>
        ) : null
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorItem: {
    width: '48%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
}); 