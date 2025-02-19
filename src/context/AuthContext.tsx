import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { enableBiometrics } from '@/src/utils/biometrics';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
  socialSignIn: (provider: 'google' | 'apple') => Promise<void>;
  biometricLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      // Enable biometrics for next time if user successfully logs in
      await enableBiometrics(user.id);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email,
        name,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      router.replace('/(tabs)');
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      // Simulate API call to send reset code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send an email with a reset code
      // For demo purposes, we'll just simulate success
      console.log('Reset code sent to:', email);
    } catch (error) {
      throw new Error('Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    setLoading(true);
    try {
      // Simulate API call to verify code and update password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would verify the code and update the password
      // For demo purposes, we'll just simulate success
      console.log('Password reset successful for:', email);
    } catch (error) {
      throw new Error('Invalid reset code');
    } finally {
      setLoading(false);
    }
  };

  const socialSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email: `${provider}@example.com`,
        name: `${provider} User`,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      router.replace('/(tabs)');
    } catch (error) {
      throw new Error(`${provider} sign in failed`);
    } finally {
      setLoading(false);
    }
  };

  const biometricLogin = async () => {
    setLoading(true);
    try {
      // Get the last logged in user
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        throw new Error('No previous login found');
      }

      const user = JSON.parse(userJson);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error) {
      throw new Error('Biometric login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      confirmPasswordReset,
      socialSignIn,
      biometricLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 