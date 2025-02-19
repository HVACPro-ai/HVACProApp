import { Link, router } from 'expo-router';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Mock registration logic
    console.log('Registering user:', email);
    // Store user session
    await AsyncStorage.setItem('userToken', 'your_token_here');
    // Navigate to Home screen after successful registration
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <Button title="Register" onPress={handleRegister} />
      <View style={styles.loginLink}>
        <Text>Already have an account? </Text>
        <Link href="login" asChild>
          <Text style={styles.link}>Login</Text>
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
  loginLink: {
    flexDirection: 'row',
    marginTop: 20,
  },
  link: {
    color: '#2f95dc',
    textDecorationLine: 'underline',
  },
}); 