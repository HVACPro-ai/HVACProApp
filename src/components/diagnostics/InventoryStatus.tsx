import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import type { InventoryStatus as InventoryStatusType } from '../../types';

interface Props {
  status: InventoryStatusType;
  onOrderPart?: () => void;
  onReservePart?: () => void;
}

export function InventoryStatus({ status, onOrderPart, onReservePart }: Props) {
  const handleOrderPress = () => {
    if (onOrderPart) {
      onOrderPart();
    }
  };

  const handleReservePress = () => {
    if (onReservePart) {
      onReservePart();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Part Information</ThemedText>
        <Ionicons 
          name={status.available ? "checkmark-circle" : "close-circle"} 
          size={24} 
          color={status.available ? "#4CAF50" : "#FF3B30"} 
        />
      </View>

      <View style={styles.infoContainer}>
        <ThemedText style={styles.label}>Part Number:</ThemedText>
        <ThemedText style={styles.value}>{status.partNumber}</ThemedText>

        <ThemedText style={styles.label}>Part Name:</ThemedText>
        <ThemedText style={styles.value}>{status.partName}</ThemedText>

        {status.available && (
          <>
            <ThemedText style={styles.label}>Quantity Available:</ThemedText>
            <ThemedText style={styles.value}>{status.quantity}</ThemedText>

            <ThemedText style={styles.label}>Location:</ThemedText>
            <ThemedText style={styles.value}>{status.location}</ThemedText>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {status.available ? (
          <ThemedButton
            title="Reserve Part"
            onPress={handleReservePress}
            style={styles.button}
          />
        ) : (
          <ThemedButton
            title="Order Part"
            onPress={handleOrderPress}
            style={[styles.button, styles.orderButton]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginVertical: 4,
  },
  orderButton: {
    backgroundColor: '#FF9500',
  },
}); 