import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ServiceImage } from '@/src/api/tasksApi';

interface Props {
  onImageCaptured: (image: ServiceImage) => void;
  type?: ServiceImage['type'];
}

export function ImageUploader({ onImageCaptured, type = 'issue' }: Props) {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera access is required to take photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadImage = async (imageAsset: ImagePicker.ImagePickerAsset) => {
    setUploading(true);
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('image', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      // TODO: Replace with your actual API endpoint
      const response = await fetch('https://your-api.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      // Create a new ServiceImage object
      const newImage: ServiceImage = {
        id: data.id || Date.now().toString(),
        url: data.url || imageAsset.uri, // Use the uploaded URL or local URI temporarily
        type: type,
        caption: '', // Can be updated later
        timestamp: new Date().toISOString(),
      };

      onImageCaptured(newImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={takePhoto}
        disabled={uploading}
      >
        <Ionicons name="camera" size={24} color="#007AFF" />
        <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={pickImage}
        disabled={uploading}
      >
        <Ionicons name="images" size={24} color="#007AFF" />
        <ThemedText style={styles.buttonText}>Choose Photo</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: 120,
  },
  buttonText: {
    marginTop: 5,
    color: '#007AFF',
    fontSize: 14,
  },
}); 