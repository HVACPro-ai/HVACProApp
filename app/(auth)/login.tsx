import { Link, router } from 'expo-router';
import { StyleSheet, TextInput, Button, View, Text, Alert } from 'react-native';
import React, { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      console.log('Attempting login with:', email);
      
      // Set authentication state and navigate
      if (global.setIsAuthenticated) {
        await Promise.resolve(global.setIsAuthenticated(true));
        console.log('Authentication state set to true');
        
        // Navigate to tabs
        await router.replace('/(tabs)');
        console.log('Navigation completed');
      } else {
        throw new Error('setIsAuthenticated is not available');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Error', 'Failed to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.registerLink}>
        <Text>Don't have an account? </Text>
        <Link href="register" asChild>
          <Text style={styles.link}>Register</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 5,
  },
  registerLink: {
    flexDirection: 'row',
    marginTop: 20,
  },
  link: {
    color: '#2f95dc',
    textDecorationLine: 'underline',
  },
});