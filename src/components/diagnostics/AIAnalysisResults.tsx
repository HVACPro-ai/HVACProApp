import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedButton } from '../ThemedComponents';
import type { OrderDetails, AIAnalysisResult } from '../../types';

interface Props {
  results: AIAnalysisResult;
  onPartOrder: (orderDetails: OrderDetails) => Promise<void>;
}

export const AIAnalysisResults: React.FC<Props> = ({ results, onPartOrder }) => {
  const handlePartOrder = async () => {
    const orderDetails: OrderDetails = {
      partNumber: results.partSuggestions[0] || '',
      quantity: 1,
      priority: 'standard',
      notes: results.diagnosis,
    };
    await onPartOrder(orderDetails);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Analysis Results</ThemedText>
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Diagnosis</ThemedText>
        <ThemedText>{results.diagnosis}</ThemedText>
        <ThemedText style={styles.confidence}>Confidence: {results.confidence}%</ThemedText>
      </View>

      {results.recommendations?.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recommendations</ThemedText>
          {results.recommendations.map((rec, index) => (
            <ThemedText key={index} style={styles.item}>• {rec}</ThemedText>
          ))}
        </View>
      )}

      {results.partSuggestions?.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Suggested Parts</ThemedText>
          {results.partSuggestions.map((part, index) => (
            <ThemedText key={index} style={styles.item}>• {part}</ThemedText>
          ))}
          <ThemedButton
            title="Order Parts"
            onPress={handlePartOrder}
            style={styles.button}
          />
        </View>
      )}

      {results.optimizations?.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Optimization Tips</ThemedText>
          {results.optimizations.map((opt, index) => (
            <ThemedText key={index} style={styles.item}>• {opt}</ThemedText>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    marginBottom: 4,
  },
  confidence: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 8,
  },
}); 