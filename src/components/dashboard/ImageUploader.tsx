import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import type { ServiceImage } from '../../types';

interface Props {
  onImageCaptured: (image: ServiceImage) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<Props> = ({ onImageCaptured, disabled }) => {
  const handleImageSelect = async () => {
    // Implement image selection logic here
    const mockImage: ServiceImage = {
      uri: 'mock-uri',
      type: 'image/jpeg',
      name: 'test-image.jpg'
    };
    onImageCaptured(mockImage);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleImageSelect}
      disabled={disabled}
    >
      <Ionicons name="camera" size={24} color="#007AFF" />
      <ThemedText style={styles.text}>Add Photo</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    marginLeft: 8,
    color: '#007AFF',
  },
}); 