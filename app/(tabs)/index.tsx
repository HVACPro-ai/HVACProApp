import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Alert, FlatList } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Logo from '../../components/Logo';

export default function TabsHomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const role = await AsyncStorage.getItem('userRole');
      setUserName(name || 'User');
      setUserRole(role || 'Technician');
    };

    const loadRecentActivities = async () => {
      // Mock recent activities, replace with actual data fetching
      const activities = [
        { id: '1', title: 'Service Call for John Doe' },
        { id: '2', title: 'Diagnostic for AC Unit' },
      ];
      setRecentActivities(activities);
    };

    loadUserData();
    loadRecentActivities();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Logged Out', 'You have successfully logged out.');
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View style={styles.headerContent}>
        <ThemedText style={styles.title}>Welcome, {userName}!</ThemedText>
        <ThemedText style={styles.role}>Role: {userRole}</ThemedText>
      </View>

      <View style={styles.quickActions}>
        <Button title="Start Diagnostic" onPress={() => router.push('/(tabs)/diagnostics')} />
        <Button title="Check Inventory" onPress={() => router.push('/(tabs)/inventory')} />
        <Button title="View Service Calls" onPress={() => router.push('/(tabs)/serviceCalls')} />
      </View>

      <View style={styles.recentActivities}>
        <ThemedText style={styles.sectionTitle}>Recent Activities</ThemedText>
        <FlatList
          data={recentActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedText style={styles.activityItem}>{item.title}</ThemedText>
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
    marginVertical: 20,
    gap: 10,
  },
  recentActivities: {
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