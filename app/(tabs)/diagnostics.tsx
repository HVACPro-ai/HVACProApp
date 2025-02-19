import { StyleSheet, View, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';

export default function DiagnosticsScreen() {
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = () => {
    console.log('Model Number:', modelNumber);
    console.log('Serial Number:', serialNumber);
    console.log('Symptoms:', symptoms);

    // Example logic for suggestions
    let suggestions = '';
    if (symptoms.toLowerCase().includes('not cooling')) {
      suggestions = 'Check the thermostat settings and ensure the unit is powered on.';
    } else if (symptoms.toLowerCase().includes('leaking')) {
      suggestions = 'Inspect the drain line for clogs and check for refrigerant leaks.';
    } else {
      suggestions = 'Please provide more details about the symptoms.';
    }

    alert(`Suggestions: ${suggestions}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Diagnostics</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Model Number"
        value={modelNumber}
        onChangeText={setModelNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Symptoms"
        value={symptoms}
        onChangeText={setSymptoms}
      />
      <Button title="Submit Diagnostic" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
});