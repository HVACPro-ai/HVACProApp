import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedInput } from '../../components/ThemedInput';
import { ThemedButton } from '../../components/ThemedButton';
import { fetchDiagnostics } from '../../api/diagnosticsApi';

export default function Diagnostics() {
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDiagnosis = async () => {
    setLoading(true);
    try {
      const result = await fetchDiagnostics(modelNumber, serialNumber, symptoms);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Error getting diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText style={styles.title}>HVAC Diagnostics</ThemedText>
        
        <View style={styles.infoSection}>
          <ThemedText style={styles.description}>
            Enter equipment details and symptoms below to get diagnostic suggestions.
          </ThemedText>
        </View>

        <ThemedInput
          value={modelNumber}
          onChangeText={setModelNumber}
          placeholder="Model Number"
          style={styles.input}
        />
        <ThemedInput
          value={serialNumber}
          onChangeText={setSerialNumber}
          placeholder="Serial Number"
          style={styles.input}
        />
        <ThemedInput
          value={symptoms}
          onChangeText={setSymptoms}
          placeholder="Symptoms"
          style={styles.input}
        />
        <ThemedButton title="Get Diagnosis" onPress={handleDiagnosis} />

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {suggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            <ThemedText style={styles.subtitle}>Suggestions:</ThemedText>
            {suggestions.map((suggestion, index) => (
              <ThemedText key={index} style={styles.suggestion}>
                • {suggestion}
              </ThemedText>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
  },
  suggestionsSection: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestion: {
    marginBottom: 5,
    fontSize: 16,
  },
});