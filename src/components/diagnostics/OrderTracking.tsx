import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedComponents';
import type { OrderDetails } from '../../types';

interface Props {
  order: OrderDetails;
}

export const OrderTracking: React.FC<Props> = ({ order }) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Order Status</ThemedText>
      <View style={styles.details}>
        <ThemedText>Part Number: {order.partNumber}</ThemedText>
        <ThemedText>Quantity: {order.quantity}</ThemedText>
        <ThemedText>Priority: {order.priority}</ThemedText>
        {order.notes && <ThemedText>Notes: {order.notes}</ThemedText>}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  details: {
    gap: 8,
  },
}); 