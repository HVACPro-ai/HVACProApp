import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentStep: number;
}

export function DiagnosticGuide({ visible, onClose, currentStep }: Props) {
  const getStepGuide = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Equipment Information',
          steps: [
            'Locate the model number on your HVAC unit',
            'Find the serial number (usually near the model number)',
            'Enter both numbers exactly as shown on the unit'
          ]
        };
      case 2:
        return {
          title: 'Describing Symptoms',
          steps: [
            'List any unusual sounds, smells, or behavior',
            'Note when the problems started',
            'Describe any patterns you\'ve noticed',
            'Include temperature or comfort issues'
          ]
        };
      case 3:
        return {
          title: 'Collecting Data',
          steps: [
            'Take clear photos of any visible issues',
            'Capture the display panel if showing errors',
            'Enter current sensor readings if available',
            'Include any unusual meter readings'
          ]
        };
      case 4:
        return {
          title: 'Understanding Results',
          steps: [
            'Review the AI\'s confidence level',
            'Check immediate action items',
            'Note recommended maintenance',
            'Consider efficiency suggestions'
          ]
        };
      default:
        return { title: '', steps: [] };
    }
  };

  const guide = getStepGuide();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.title}>{guide.title}</ThemedText>
          {guide.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <ThemedText style={styles.stepNumber}>{index + 1}</ThemedText>
              <ThemedText style={styles.stepText}>{step}</ThemedText>
            </View>
          ))}
          <ThemedButton
            title="Got it"
            onPress={onClose}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
}); 