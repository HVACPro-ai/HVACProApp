import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ServiceImage } from '../../types';

export interface Props {
  images: ServiceImage[];
  onImageAdded: (image: ServiceImage) => void;
  onImageRemoved: (index: number) => void;
}

export function ImageUploader({ images, onImageAdded, onImageRemoved }: Props) {
  // Implementation here
  return <View />; // Replace with your actual implementation
} 