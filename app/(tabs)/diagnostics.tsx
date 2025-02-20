import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { fetchDiagnostics } from '@/src/api/diagnosticsApi';
import DiagnosticsScreen from '../../src/screens/DiagnosticsScreen';
import { useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DiagnosticStep = 'initial' | 'details' | 'symptoms' | 'results';

export default function DiagnosticsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return <DiagnosticsScreen navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  bulletPoints: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  bullet: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 10,
  },
});