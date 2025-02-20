import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedButton } from '../ThemedComponents';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { ServiceImage } from '../../types';

interface Props {
  images: ServiceImage[];
  onImagesChange: (images: ServiceImage[]) => void;
  error?: string;
}

export const ImageUploader: React.FC<Props> = ({ images, onImagesChange, error }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage: ServiceImage = {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: `image-${Date.now()}.jpg`,
      };
      onImagesChange([...images, newImage]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Equipment Photos</ThemedText>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      
      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Ionicons name="add-circle" size={40} color="#007AFF" />
          <ThemedText style={styles.addButtonText}>Add Photo</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  imageContainer: {
    width: '33.33%',
    padding: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 4,
  },
  addButton: {
    width: '33.33%',
    padding: 8,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#007AFF',
    marginTop: 8,
  },
}); 