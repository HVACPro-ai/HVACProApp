import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  ScrollView,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { ServiceImage } from '@/src/api/tasksApi';

interface Props {
  images: ServiceImage[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THUMBNAIL_SIZE = 80;
const THUMBNAIL_SPACING = 10;

export function ImageGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState<ServiceImage | null>(null);

  const getTypeIcon = (type: ServiceImage['type']) => {
    switch (type) {
      case 'before':
        return 'time-outline';
      case 'after':
        return 'checkmark-circle-outline';
      case 'issue':
        return 'warning-outline';
      case 'parts':
        return 'hardware-chip-outline';
    }
  };

  const getTypeColor = (type: ServiceImage['type']) => {
    switch (type) {
      case 'before':
        return '#FF9500';
      case 'after':
        return '#34C759';
      case 'issue':
        return '#FF3B30';
      case 'parts':
        return '#007AFF';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={styles.thumbnailContainer}
            onPress={() => setSelectedImage(image)}
          >
            <Image
              source={{ uri: image.url }}
              style={styles.thumbnail}
            />
            <View 
              style={[
                styles.typeIndicator, 
                { backgroundColor: getTypeColor(image.type) }
              ]}
            >
              <Ionicons 
                name={getTypeIcon(image.type)} 
                size={14} 
                color="#FFF" 
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.url }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                <View style={styles.imageInfo}>
                  <View style={styles.imageTypeContainer}>
                    <Ionicons 
                      name={getTypeIcon(selectedImage.type)} 
                      size={20} 
                      color={getTypeColor(selectedImage.type)} 
                    />
                    <ThemedText style={styles.imageType}>
                      {selectedImage.type.charAt(0).toUpperCase() + selectedImage.type.slice(1)}
                    </ThemedText>
                  </View>
                  {selectedImage.caption && (
                    <ThemedText style={styles.caption}>
                      {selectedImage.caption}
                    </ThemedText>
                  )}
                  <ThemedText style={styles.timestamp}>
                    {formatTimestamp(selectedImage.timestamp)}
                  </ThemedText>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  scrollContent: {
    padding: 5,
  },
  thumbnailContainer: {
    marginRight: THUMBNAIL_SPACING,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
  },
  typeIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  imageTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageType: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
}); 