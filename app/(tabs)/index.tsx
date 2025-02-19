import React from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Logo from '../../components/Logo';

export default function TabsHomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Logged Out', 'You have successfully logged out.');
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View style={styles.headerContent}>
        <ThemedText style={styles.title}>Welcome to HVAC Pro</ThemedText>
      </View>
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ThemedText>• Start a new diagnostic</ThemedText>
        <ThemedText>• Check inventory</ThemedText>
        <ThemedText>• View schedule</ThemedText>
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
  section: {
    marginTop: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 