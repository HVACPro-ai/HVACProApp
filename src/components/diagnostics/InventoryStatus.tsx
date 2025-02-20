import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import type { InventoryStatus as InventoryStatusType } from '../../types';

interface Props {
  status: InventoryStatusType;
}

export function InventoryStatus({ status }: Props) {
  const getStatusColor = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return '#4CAF50';
      case 'back_ordered':
        return '#FFA500';
      case 'discontinued':
        return '#FF0000';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{status.partName}</ThemedText>
        <ThemedText style={styles.partNumber}>Part #: {status.partNumber}</ThemedText>
      </View>

      <View style={styles.statusRow}>
        <Ionicons
          name={status.availability === 'in_stock' ? 'checkmark-circle' : 'warning'}
          size={24}
          color={getStatusColor(status.availability)}
        />
        <ThemedText style={[styles.status, { color: getStatusColor(status.availability) }]}>
          {status.availability === 'in_stock' ? 'In Stock' : status.availability === 'back_ordered' ? 'Back Ordered' : 'Discontinued'}
        </ThemedText>
      </View>

      {status.quantity !== undefined && (
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>Quantity:</ThemedText>
          <ThemedText style={styles.value}>{status.quantity}</ThemedText>
        </View>
      )}

      {status.location && (
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>Location:</ThemedText>
          <ThemedText style={styles.value}>{status.location}</ThemedText>
        </View>
      )}

      {status.estimatedDelivery && (
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>Estimated Delivery:</ThemedText>
          <ThemedText style={styles.value}>{status.estimatedDelivery}</ThemedText>
        </View>
      )}

      {status.alternativeParts && status.alternativeParts.length > 0 && (
        <View style={styles.alternativesContainer}>
          <ThemedText style={styles.label}>Alternative Parts:</ThemedText>
          {status.alternativeParts.map((part, index) => (
            <ThemedText key={index} style={styles.alternativePart}>{part}</ThemedText>
          ))}
        </View>
      )}
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
  partNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  alternativesContainer: {
    marginTop: 8,
  },
  alternativePart: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
}); 