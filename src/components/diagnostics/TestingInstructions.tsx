import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedComponents';
import { Ionicons } from '@expo/vector-icons';
import type { TestingInstruction } from '../../types';
import { ThemedButton } from '../ThemedButton';

interface Props {
  instructions: TestingInstruction[];
  onComplete?: (stepIndex: number) => void;
}

export const TestingInstructions: React.FC<Props> = ({ instructions, onComplete }) => {
  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Testing Instructions</ThemedText>
      {instructions.map((instruction, index) => (
        <View key={index} style={styles.instruction}>
          <ThemedText style={styles.stepNumber}>{index + 1}.</ThemedText>
          <ThemedText style={styles.stepText}>{instruction.text}</ThemedText>
        </View>
      ))}
    </ScrollView>
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
  instruction: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
  },
  instructionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  instructionImage: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  warningText: {
    color: '#FFA500',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  completedInstruction: {
    opacity: 0.8,
    backgroundColor: '#f8f8f8',
  },
  completedIcon: {
    marginLeft: 8,
  },
  completeButton: {
    marginTop: 16,
  },
}); 