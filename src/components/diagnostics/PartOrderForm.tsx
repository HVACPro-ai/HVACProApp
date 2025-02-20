import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedInput } from '../ThemedInput';
import { ThemedButton } from '../ThemedButton';

interface Props {
  partNumber: string;
  partName: string;
  onSubmit: (orderDetails: OrderDetails) => void;
  onCancel: () => void;
}

interface OrderDetails {
  quantity: number;
  priority: 'standard' | 'express' | 'urgent';
  notes: string;
}

export function PartOrderForm({ partNumber, partName, onSubmit, onCancel }: Props) {
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'standard' | 'express' | 'urgent'>('standard');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (parseInt(quantity) < 1) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        quantity: parseInt(quantity),
        priority,
        notes,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Order Part</ThemedText>
      <ThemedText style={styles.partInfo}>{partName} ({partNumber})</ThemedText>

      <ThemedInput
        label="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <ThemedInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <View style={styles.priorityContainer}>
        <ThemedText style={styles.label}>Priority:</ThemedText>
        <View style={styles.priorityButtons}>
          {(['standard', 'express', 'urgent'] as const).map((p) => (
            <ThemedButton
              key={p}
              title={p.charAt(0).toUpperCase() + p.slice(1)}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityButton,
                priority === p && styles.selectedPriority,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Cancel"
          onPress={onCancel}
          style={[styles.button, styles.cancelButton]}
        />
        <ThemedButton
          title="Submit Order"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  partInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  priorityContainer: {
    marginBottom: 16,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  selectedPriority: {
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
}); 