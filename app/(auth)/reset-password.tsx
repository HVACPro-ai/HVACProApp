import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { validateEmail } from '@/src/utils/validation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword, loading } = useAuth();

  const handleResetPassword = async () => {
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
      // Navigate to confirmation screen after 2 seconds
      setTimeout(() => {
        router.push({
          pathname: '/(auth)/reset-password-confirm',
          params: { email }
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Reset Password</ThemedText>
      
      <View style={styles.form}>
        <ThemedText style={styles.description}>
          Enter your email address and we'll send you a code to reset your password.
        </ThemedText>

        <ThemedInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={error}
          style={styles.input}
          editable={!loading && !success}
        />

        {error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : null}

        {success ? (
          <ThemedText style={styles.success}>
            Reset code sent! Check your email.
          </ThemedText>
        ) : null}

        <ThemedButton 
          title={loading ? "Sending..." : "Send Reset Code"}
          onPress={handleResetPassword}
          disabled={loading || success}
          style={styles.button}
        />

        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          disabled={loading}
        >
          <ThemedText style={styles.backButtonText}>
            Back to Login
          </ThemedText>
        </TouchableOpacity>

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
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
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
  success: {
    color: '#34c759',
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
  },
}); 