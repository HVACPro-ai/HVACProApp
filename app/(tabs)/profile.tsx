import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userEmail', email);
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile Management</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Save" onPress={handleSave} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 5,
  },
}); 