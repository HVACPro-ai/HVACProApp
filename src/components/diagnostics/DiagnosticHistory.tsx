import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import type { DiagnosticState } from '../../types';

interface Props {
  history: Array<DiagnosticState & { timestamp: number }>;
  onSelectDiagnostic: (diagnostic: DiagnosticState) => void;
}

export function DiagnosticHistory({ history, onSelectDiagnostic }: Props) {
  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Recent Diagnostics</ThemedText>
      {history.map((diagnostic, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => onSelectDiagnostic(diagnostic)}
        >
          <View style={styles.itemHeader}>
            <ThemedText style={styles.modelNumber}>
              {diagnostic.modelNumber}
            </ThemedText>
            <ThemedText style={styles.date}>
              {new Date(diagnostic.timestamp).toLocaleDateString()}
            </ThemedText>
          </View>
          
          <ThemedText style={styles.brand}>{diagnostic.brand}</ThemedText>
          
          {diagnostic.confirmedIssue && (
            <ThemedText style={styles.issue}>
              Issue: {diagnostic.confirmedIssue}
            </ThemedText>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
  },
  brand: {
    color: '#666',
    marginBottom: 4,
  },
  issue: {
    color: '#FF3B30',
  },
}); 