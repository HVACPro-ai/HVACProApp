import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import type { AIQuestion } from '../../types';

interface Props {
  question: AIQuestion;
  onAnswer: (answer: string) => void;
  previousAnswers?: Record<string, string>;
  isLoading?: boolean;
}

export function AIQuestionPrompt({ 
  question, 
  onAnswer, 
  previousAnswers,
  isLoading 
}: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.question}>{question.text}</ThemedText>
      
      {previousAnswers && previousAnswers[question.id] && (
        <ThemedText style={styles.previousAnswer}>
          Previous answer: {previousAnswers[question.id]}
        </ThemedText>
      )}
      
      {question.type === 'yes_no' ? (
        <View style={styles.buttonRow}>
          <ThemedButton
            title="Yes"
            onPress={() => onAnswer('yes')}
            style={styles.optionButton}
            disabled={isLoading}
          />
          <ThemedButton
            title="No"
            onPress={() => onAnswer('no')}
            style={styles.optionButton}
            disabled={isLoading}
          />
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          {question.options?.map((option, index) => (
            <ThemedButton
              key={index}
              title={option}
              onPress={() => onAnswer(option)}
              style={styles.optionButton}
              disabled={isLoading}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionButton: {
    marginVertical: 8,
  },
  previousAnswer: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 