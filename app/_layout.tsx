import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a delay
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
} 