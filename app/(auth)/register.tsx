import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { validateEmail, validatePassword } from '@/src/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Register() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, loading } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with a number and special character';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await signUp(email, password, name);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Registration failed'
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

      <ThemedText style={styles.title}>Create Account</ThemedText>
      
      <View style={styles.form}>
        <ThemedInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          style={styles.input}
        />

        <ThemedInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
          style={styles.input}
        />

        <ThemedInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          style={styles.input}
        />

        <ThemedInput
          placeholder="Confirm Password"
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
          title={loading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
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
          onPress={() => router.back()}
          style={styles.footerButton}
          disabled={loading}
        >
          <ThemedText style={styles.footerText}>
            Already have an account? Sign in
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