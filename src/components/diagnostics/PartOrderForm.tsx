import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedInput, ThemedButton } from '../ThemedComponents';
import type { EquipmentTypeInfo, OrderDetails, OrderPriority } from '../../types';

interface Props {
  equipment: EquipmentTypeInfo;
  onSubmit: (orderDetails: OrderDetails) => Promise<void>;
  onClose: () => void;
}

export const PartOrderForm: React.FC<Props> = ({ equipment, onSubmit, onClose }) => {
  const [partNumber, setPartNumber] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [priority, setPriority] = useState<OrderPriority>('standard');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!partNumber || !quantity) return;

    setLoading(true);
    try {
      await onSubmit({
        partNumber,
        quantity: parseInt(quantity, 10),
        priority,
        notes,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Order Parts</ThemedText>
      <ThemedText style={styles.subtitle}>
        Equipment: {equipment.manufacturer} {equipment.model}
      </ThemedText>

      <ThemedInput
        value={partNumber}
        onChangeText={setPartNumber}
        placeholder="Part Number"
        style={styles.input}
      />

      <ThemedInput
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
        style={styles.input}
      />

      <ThemedInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        multiline
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Cancel"
          onPress={onClose}
          style={styles.button}
          disabled={loading}
        />
        <ThemedButton
          title={loading ? 'Submitting...' : 'Submit'}
          onPress={handleSubmit}
          style={[styles.button, styles.primaryButton]}
          disabled={!partNumber || !quantity || loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
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
  primaryButton: {
    backgroundColor: '#007AFF',
  },
}); 