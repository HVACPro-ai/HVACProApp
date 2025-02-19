import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Alert, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Logo from '../../components/Logo';
import { FontAwesome } from '@expo/vector-icons';
import { ServiceCall, fetchServiceCalls } from '@/src/api/serviceCallsApi';
import { Ionicons } from '@expo/vector-icons';

interface QuickAction {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface UpcomingCall extends ServiceCall {
  time: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [upcomingCalls, setUpcomingCalls] = useState<UpcomingCall[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const role = await AsyncStorage.getItem('userRole');
      setUserName(name || 'User');
      setUserRole(role || 'Technician');
    };

    const loadUpcomingCalls = async () => {
      setLoading(true);
      try {
        const calls = await fetchServiceCalls();
        const upcomingCallsData = calls.map(call => ({
          ...call,
          time: new Date(call.date).toLocaleTimeString()
        }));
        setUpcomingCalls(upcomingCallsData);
      } catch (error) {
        console.error('Error loading upcoming calls:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadUpcomingCalls();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Logged Out', 'You have successfully logged out.');
    router.replace('/(auth)/login');
  };

  const quickActions: QuickAction[] = [
    {
      title: 'New Call',
      icon: 'add-circle',
      onPress: () => router.push('/serviceCalls')
    },
    {
      title: 'Diagnose',
      icon: 'medical',
      onPress: () => router.push('/diagnostics')
    },
    {
      title: 'Inventory',
      icon: 'list',
      onPress: () => router.push('/inventory')
    }
  ];

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.title}
      style={styles.quickActionButton}
      onPress={action.onPress}
    >
      <Ionicons name={action.icon} size={24} color="#007AFF" />
      <ThemedText style={styles.quickActionText}>{action.title}</ThemedText>
    </TouchableOpacity>
  );

  const renderUpcomingCall = (call: UpcomingCall) => (
    <TouchableOpacity
      key={call.id}
      style={styles.callCard}
      onPress={() => router.push('/serviceCalls')}
    >
      <View style={styles.callInfo}>
        <ThemedText style={styles.callCustomer}>{call.customerName} - {call.time}</ThemedText>
        <ThemedText style={styles.callAddress}>{call.address}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Logo />
      <ScrollView>
        <ThemedText style={styles.title}>Welcome, {userName}!</ThemedText>
        <ThemedText style={styles.role}>Role: {userRole}</ThemedText>

        <View style={styles.quickActionsContainer}>
          {quickActions.map(renderQuickAction)}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Today's Service Calls</ThemedText>
          {upcomingCalls.length > 0 ? (
            upcomingCalls.map(renderUpcomingCall)
          ) : (
            <ThemedText style={styles.noCallsText}>
              No upcoming calls scheduled
            </ThemedText>
          )}
        </View>
      </ScrollView>
      <Button title="Logout" onPress={handleLogout} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
  },
  quickActionText: {
    marginTop: 5,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  callInfo: {
    flex: 1,
  },
  callCustomer: {
    fontSize: 16,
    fontWeight: '500',
  },
  callAddress: {
    fontSize: 14,
    color: '#666',
  },
  noCallsText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
}); 