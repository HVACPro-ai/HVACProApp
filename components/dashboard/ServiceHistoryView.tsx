import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ServiceHistory } from '@/src/api/tasksApi';
import { Ionicons } from '@expo/vector-icons';
import { ImageGallery } from './ImageGallery';

interface Props {
  history: ServiceHistory[];
}

export function ServiceHistoryView({ history }: Props) {
  const getTypeIcon = (type: ServiceHistory['type']) => {
    switch (type) {
      case 'service_call':
        return 'build';
      case 'installation':
        return 'hammer';
      case 'maintenance':
        return 'construct';
      case 'quote':
        return 'document-text';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Service History</ThemedText>
      <View style={styles.historyList}>
        {history.map((record) => (
          <View key={record.id} style={styles.historyItem}>
            <View style={styles.header}>
              <View style={styles.typeContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={getTypeIcon(record.type)} 
                    size={20} 
                    color="#007AFF" 
                  />
                </View>
                <View>
                  <ThemedText style={styles.date}>
                    {formatDate(record.date)}
                  </ThemedText>
                  <ThemedText style={styles.type}>
                    {record.type.replace('_', ' ')}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.cost}>
                {formatCurrency(record.cost)}
              </ThemedText>
            </View>
            
            <ThemedText style={styles.technician}>
              Technician: {record.technician}
            </ThemedText>
            
            <ThemedText style={styles.description}>
              {record.description}
            </ThemedText>
            
            {record.partsReplaced && record.partsReplaced.length > 0 && (
              <View style={styles.partsContainer}>
                <ThemedText style={styles.partsTitle}>
                  Parts Replaced:
                </ThemedText>
                {record.partsReplaced.map((part, index) => (
                  <View key={index} style={styles.partItem}>
                    <Ionicons name="hardware-chip" size={16} color="#666" />
                    <ThemedText style={styles.partText}>{part}</ThemedText>
                  </View>
                ))}
              </View>
            )}
            
            {record.images && record.images.length > 0 && (
              <ImageGallery images={record.images} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyList: {
    // Remove maxHeight constraint
  },
  historyItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
  },
  type: {
    color: '#666',
    textTransform: 'capitalize',
  },
  cost: {
    fontWeight: '600',
    color: '#007AFF',
  },
  technician: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  partsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  partsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  partText: {
    marginLeft: 8,
    color: '#666',
  },
}); 