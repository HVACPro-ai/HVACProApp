import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Logo from '../../components/Logo';
import { FontAwesome } from '@expo/vector-icons';
import { fetchServiceCalls } from '../../api/serviceCallsApi';

export default function TabsHomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [todayServiceCalls, setTodayServiceCalls] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const role = await AsyncStorage.getItem('userRole');
      setUserName(name || 'User');
      setUserRole(role || 'Technician');
    };

    const loadTodayServiceCalls = async () => {
      const calls = await fetchServiceCalls();
      const today = new Date().toLocaleDateString();
      const filteredCalls = calls.filter(call => call.date === today);
      setTodayServiceCalls(filteredCalls);
    };

    loadUserData();
    loadTodayServiceCalls();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Logged Out', 'You have successfully logged out.');
    router.replace('/(auth)/login');
  };

  const QuickActionCard = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <FontAwesome name={icon} size={24} color="#fff" />
      <ThemedText style={styles.cardText}>{title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View style={styles.headerContent}>
        <ThemedText style={styles.title}>Welcome, {userName}!</ThemedText>
        <ThemedText style={styles.role}>Role: {userRole}</ThemedText>
      </View>

      <View style={styles.quickActions}>
        <QuickActionCard title="Start Diagnostic" icon="wrench" onPress={() => router.push('/(tabs)/diagnostics')} />
        <QuickActionCard title="Check Inventory" icon="box" onPress={() => router.push('/(tabs)/inventory')} />
        <QuickActionCard title="View Service Calls" icon="clipboard" onPress={() => router.push('/(tabs)/serviceCalls')} />
      </View>

      <View style={styles.todayServiceCalls}>
        <ThemedText style={styles.sectionTitle}>Today's Service Calls</ThemedText>
        <FlatList
          data={todayServiceCalls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedText style={styles.activityItem}>{item.customerName} - {item.time}</ThemedText>
          )}
        />
      </View>

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
  headerContent: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#2f95dc',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 16,
  },
  todayServiceCalls: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityItem: {
    fontSize: 16,
    marginBottom: 5,
  },
}); 