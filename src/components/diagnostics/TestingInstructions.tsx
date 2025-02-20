import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import type { TestingInstruction } from '../../types';
import { ThemedButton } from '../ThemedButton';

interface Props {
  instructions: TestingInstruction[];
  onComplete?: (stepIndex: number) => void;
}

export function TestingInstructions({ instructions, onComplete }: Props) {
  return (
    <ScrollView style={styles.container}>
      {instructions.map((instruction, index) => (
        <View key={index} style={[
          styles.instructionItem,
          instruction.completed && styles.completedInstruction
        ]}>
          <View style={styles.stepHeader}>
            <ThemedText style={styles.stepNumber}>Step {instruction.step}</ThemedText>
            {instruction.completed && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.completedIcon} />
            )}
          </View>
          
          <ThemedText style={styles.description}>{instruction.description}</ThemedText>
          
          {instruction.imageUrl && (
            <Image
              source={{ uri: instruction.imageUrl }}
              style={styles.instructionImage}
              resizeMode="contain"
            />
          )}
          
          {instruction.warningNote && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={24} color="#FFA500" />
              <ThemedText style={styles.warningText}>{instruction.warningNote}</ThemedText>
            </View>
          )}

          {onComplete && !instruction.completed && (
            <ThemedButton
              title="Mark as Complete"
              onPress={() => onComplete(index)}
              style={styles.completeButton}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
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