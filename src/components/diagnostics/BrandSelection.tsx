import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedInput } from '../ThemedInput';
import { ThemedButton } from '../ThemedButton';

interface Props {
  selectedBrand: string;
  onSelect: (brand: string) => void;
  onCustomBrand: (brand: string) => void;
  error?: string;
}

export function BrandSelection({ selectedBrand, onSelect, onCustomBrand, error }: Props) {
  const [customBrand, setCustomBrand] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const commonBrands = ['Carrier', 'Trane', 'Lennox', 'Rheem', 'Goodman'];

  const handleCustomBrand = () => {
    if (customBrand.trim()) {
      onCustomBrand(customBrand.trim());
    }
  };

  const handleBasicContinue = () => {
    onSelect('Basic');
    setShowCustomInput(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandButtons}>
        {commonBrands.map((brand) => (
          <ThemedButton
            key={brand}
            title={brand}
            onPress={() => onSelect(brand)}
            style={[
              styles.brandButton,
              selectedBrand === brand && styles.selectedBrand
            ]}
          />
        ))}
      </View>

      {showCustomInput ? (
        <View style={styles.customInputContainer}>
          <ThemedInput
            placeholder="Enter brand name"
            value={customBrand}
            onChangeText={setCustomBrand}
            style={styles.customInput}
          />
          <ThemedButton
            title="Add Brand"
            onPress={handleCustomBrand}
            style={styles.addButton}
          />
        </View>
      ) : (
        <View style={styles.actionButtons}>
          <ThemedButton
            title="Add Custom Brand"
            onPress={() => setShowCustomInput(true)}
            style={styles.actionButton}
          />
          <ThemedButton
            title="Continue with Basic"
            onPress={handleBasicContinue}
            style={styles.actionButton}
          />
        </View>
      )}

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  brandButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  brandButton: {
    marginBottom: 8,
    minWidth: '45%',
  },
  selectedBrand: {
    backgroundColor: '#007AFF',
  },
  customInputContainer: {
    marginTop: 16,
  },
  customInput: {
    marginBottom: 8,
  },
  addButton: {
    marginTop: 8,
  },
  actionButtons: {
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    width: '100%',
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
  },
}); 