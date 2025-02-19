import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { ServiceCall, fetchServiceCalls } from '@/src/api/serviceCallsApi';
import { fetchDiagnostics } from '@/src/api/diagnosticsApi';
import { Ionicons } from '@expo/vector-icons';

type CallStatus = 'scheduled' | 'in-progress' | 'completed';

interface ServiceCallWithStatus extends ServiceCall {
  status: CallStatus;
  priority: 'high' | 'medium' | 'low';
}

export default function ServiceCalls() {
  const [serviceCalls, setServiceCalls] = useState<ServiceCallWithStatus[]>([]);
  const [filterStatus, setFilterStatus] = useState<CallStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadServiceCalls();
  }, []);

  const loadServiceCalls = async () => {
    try {
      const calls = await fetchServiceCalls();
      // Add mock status and priority for now
      const callsWithStatus = calls.map(call => ({
        ...call,
        status: 'scheduled' as CallStatus,
        priority: 'medium' as 'high' | 'medium' | 'low'
      }));
      setServiceCalls(callsWithStatus);
    } catch (error) {
      console.error('Error loading service calls:', error);
    }
  };

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case 'scheduled': return '#007AFF';
      case 'in-progress': return '#FF9500';
      case 'completed': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'alert';
      case 'low': return 'information-circle';
      default: return 'information-circle';
    }
  };

  const filteredCalls = serviceCalls
    .filter(call => filterStatus === 'all' || call.status === filterStatus)
    .filter(call => 
      call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderServiceCall = (call: ServiceCallWithStatus) => (
    <TouchableOpacity 
      key={call.id} 
      style={styles.callCard}
      onPress={() => {/* Navigate to call details */}}
    >
      <View style={styles.callHeader}>
        <View style={styles.customerInfo}>
          <ThemedText style={styles.customerName}>{call.customerName}</ThemedText>
          <ThemedText style={styles.date}>
            {new Date(call.date).toLocaleDateString()}
          </ThemedText>
        </View>
        <Ionicons 
          name={getPriorityIcon(call.priority)} 
          size={24} 
          color={getStatusColor(call.status)}
        />
      </View>
      
      <ThemedText style={styles.address}>{call.address}</ThemedText>
      <ThemedText style={styles.description}>{call.description}</ThemedText>
      
      <View style={styles.callFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(call.status) }]}>
          <ThemedText style={styles.statusText}>
            {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
          </ThemedText>
        </View>
        <ThemedText style={styles.phone}>{call.phoneNumber}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Service Calls</ThemedText>
        <ThemedButton 
          title="New Call" 
          onPress={() => {/* Navigate to new call form */}}
        />
      </View>

      <ThemedInput
        placeholder="Search calls..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <View style={styles.filterContainer}>
        {(['all', 'scheduled', 'in-progress', 'completed'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <ThemedText style={styles.filterText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredCalls.map(renderServiceCall)}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  callCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  callFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
}); 