import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { fetchDiagnostics } from '../api/diagnosticsApi';

interface DiagnosticResult {
  suggestions: string[];
}

export default function DiagnosticTool() {
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);

  const handleSubmit = async () => {
    if (!modelNumber || !serialNumber) {
      Alert.alert('Error', 'Please enter both model and serial numbers.');
      return;
    }

    try {
      const result = await fetchDiagnostics(modelNumber, serialNumber, symptoms);
      setDiagnostics(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch diagnostics. Please try again.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Model Number"
        value={modelNumber}
        onChangeText={setModelNumber}
      />
      <TextInput
        placeholder="Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
      />
      <TextInput
        placeholder="Describe Symptoms"
        value={symptoms}
        onChangeText={setSymptoms}
      />
      <Button title="Submit" onPress={handleSubmit} />
      {diagnostics && (
        <View>
          <Text>Suggestions:</Text>
          {diagnostics.suggestions.map((suggestion: string, index: number) => (
            <Text key={index}>{suggestion}</Text>
          ))}
        </View>
      )}
    </View>
  );
} 