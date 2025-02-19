import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import {
  checkBiometricsAvailable,
  authenticateWithBiometrics,
  isBiometricsEnabled
} from '@/src/utils/biometrics';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const { signIn, loading, biometricLogin } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await checkBiometricsAvailable();
      const enabled = await isBiometricsEnabled();
      setBiometricsAvailable(available && enabled);
    } catch (err) {
      console.error('Error checking biometrics:', err);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        await biometricLogin();
      }
    } catch (err) {
      setError('Biometric authentication failed');
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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

        {biometricsAvailable && (
          <TouchableOpacity 
            style={styles.biometricsButton}
            onPress={handleBiometricLogin}
            disabled={loading}
          >
            <Ionicons 
              name="finger-print" 
              size={28} 
              color="#007AFF" 
            />
            <ThemedText style={styles.biometricsText}>
              Login with Biometrics
            </ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/register')}
            disabled={loading}
          >
            <ThemedText style={styles.footerText}>
              Don't have an account? Sign up
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(auth)/reset-password')}
            disabled={loading}
          >
            <ThemedText style={styles.footerText}>
              Forgot password?
            </ThemedText>
          </TouchableOpacity>
        </View>

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
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    color: '#007AFF',
  },
  biometricsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
  },
  biometricsText: {
    color: '#007AFF',
    marginLeft: 10,
    fontSize: 16,
  },
});