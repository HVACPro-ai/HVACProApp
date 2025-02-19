import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { validatePassword } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResetPasswordConfirm() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { confirmPasswordReset, loading } = useAuth();
  const insets = useSafeAreaInsets();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = 'Reset code is required';
    }

    if (!validatePassword(newPassword)) {
      newErrors.password = 'Password must be at least 8 characters with a number and special character';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      await confirmPasswordReset(email!, code, newPassword);
      // Show success message and redirect to login
      router.replace('/(auth)/login');
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Failed to reset password'
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      <ThemedText style={styles.title}>Reset Password</ThemedText>
      
      <View style={styles.form}>
        <ThemedText style={styles.description}>
          Enter the code sent to your email and your new password.
        </ThemedText>

        <ThemedInput
          placeholder="Reset Code"
          value={code}
          onChangeText={setCode}
          error={errors.code}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
        />

        <ThemedInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          error={errors.password}
          style={styles.input}
        />

        <ThemedInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
          style={styles.input}
        />

        {errors.submit && (
          <ThemedText style={styles.error}>{errors.submit}</ThemedText>
        )}

        <ThemedButton 
          title={loading ? "Resetting..." : "Reset Password"}
          onPress={handleResetPassword}
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

        <TouchableOpacity 
          onPress={() => router.push('/(auth)/reset-password')}
          style={styles.footerButton}
          disabled={loading}
        >
          <ThemedText style={styles.footerText}>
            Resend Code
          </ThemedText>
        </TouchableOpacity>
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
  loader: {
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  footerButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  footerText: {
    color: '#007AFF',
    textAlign: 'center',
  },
}); 