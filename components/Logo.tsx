import React from 'react';
import Svg, { Circle, Text } from 'react-native-svg';
import { View } from 'react-native';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 100 }: LogoProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" fill="#007AFF" />
        <Text
          x="50"
          y="60"
          fontSize="24"
          textAnchor="middle"
          fill="white"
          fontFamily="Arial"
        >
          HVAC
        </Text>
      </Svg>
    </View>
  );
} 