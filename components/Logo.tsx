import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 100 }: LogoProps) {
  return (
    <Image
      source={require('../assets/images/icon.png')}
      style={[styles.logo, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
}); 