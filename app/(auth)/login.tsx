import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For testing, accept any email/password
      console.log('Logged in with:', email);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>HVAC Pro</ThemedText>
      
      <View style={styles.form}>
        <ThemedInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <ThemedInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : null}

        <ThemedButton 
          title={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
          style={styles.button}
        />

        {loading && (
          <ActivityIndicator 
            size="large" 
            color="#007AFF" 
            style={styles.loader}
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  }
});