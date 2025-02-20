import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedButton } from '../ThemedComponents';
import type { AIQuestion } from '../../types';

interface Props {
  question: AIQuestion;
  onAnswer: (answer: string) => void;
  previousAnswers?: Record<string, string>;
  isLoading?: boolean;
}

export const AIQuestionPrompt: React.FC<Props> = ({ question, onAnswer, previousAnswers, isLoading }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

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
            onPress={() => {
              setSelectedAnswer('yes');
              onAnswer('yes');
            }}
            style={[
              styles.optionButton,
              selectedAnswer === 'yes' && styles.selectedOption,
            ]}
            disabled={isLoading}
          />
          <ThemedButton
            title="No"
            onPress={() => {
              setSelectedAnswer('no');
              onAnswer('no');
            }}
            style={[
              styles.optionButton,
              selectedAnswer === 'no' && styles.selectedOption,
            ]}
            disabled={isLoading}
          />
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          {question.options?.map((option, index) => (
            <ThemedButton
              key={index}
              title={option}
              onPress={() => {
                setSelectedAnswer(option);
                onAnswer(option);
              }}
              style={[
                styles.optionButton,
                selectedAnswer === option && styles.selectedOption,
              ]}
              disabled={isLoading}
            />
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
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  previousAnswer: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 