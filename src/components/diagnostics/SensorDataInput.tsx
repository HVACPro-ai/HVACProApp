import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedInput } from '../ThemedComponents';
import type { SensorData } from '../../types';

interface Props {
  data: Partial<SensorData>;
  onDataChange: (data: Partial<SensorData>) => void;
  error?: string;
}

export const SensorDataInput: React.FC<Props> = ({ data, onDataChange, error }) => {
  const handleChange = (key: keyof SensorData, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onDataChange({
      ...data,
      [key]: numValue,
    });
  };

  const getDisplayValue = (value: number | undefined) => {
    return value !== undefined ? value.toString() : '';
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Sensor Readings</ThemedText>
      
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <View style={styles.inputRow}>
        <ThemedText style={styles.label}>Temperature (°F)</ThemedText>
        <ThemedInput
          value={getDisplayValue(data.temperature)}
          onChangeText={(value) => handleChange('temperature', value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputRow}>
        <ThemedText style={styles.label}>Pressure (PSI)</ThemedText>
        <ThemedInput
          value={getDisplayValue(data.pressure)}
          onChangeText={(value) => handleChange('pressure', value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputRow}>
        <ThemedText style={styles.label}>Humidity (%)</ThemedText>
        <ThemedInput
          value={getDisplayValue(data.humidity)}
          onChangeText={(value) => handleChange('humidity', value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputRow}>
        <ThemedText style={styles.label}>Airflow (CFM)</ThemedText>
        <ThemedInput
          value={getDisplayValue(data.airflow)}
          onChangeText={(value) => handleChange('airflow', value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputRow}>
        <ThemedText style={styles.label}>Power Consumption (kW)</ThemedText>
        <ThemedInput
          value={getDisplayValue(data.powerConsumption)}
          onChangeText={(value) => handleChange('powerConsumption', value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
}); 