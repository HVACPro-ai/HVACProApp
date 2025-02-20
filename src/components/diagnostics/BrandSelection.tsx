import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedInput } from '../ThemedInput';
import { ThemedButton } from '../ThemedButton';

const COMMON_BRANDS = [
  'Carrier',
  'Trane',
  'Lennox',
  'Rheem',
  'Goodman',
  'York',
  'American Standard',
  'Bryant',
  'Ruud',
  'Amana',
];

interface Props {
  onSelect: (brand: string) => void;
  selectedBrand?: string;
  onCustomBrand?: (brand: string) => void;
  recentBrands?: string[];
}

export function BrandSelection({ 
  onSelect, 
  selectedBrand, 
  onCustomBrand,
  recentBrands = [] 
}: Props) {
  const [customBrand, setCustomBrand] = useState('');
  const allBrands = [...new Set([...recentBrands, ...COMMON_BRANDS])];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Select Brand</ThemedText>
      
      {recentBrands.length > 0 && (
        <View style={styles.recentContainer}>
          <ThemedText style={styles.recentTitle}>Recent Brands</ThemedText>
          <View style={styles.recentBrands}>
            {recentBrands.map((brand) => (
              <ThemedButton
                key={brand}
                title={brand}
                onPress={() => onSelect(brand)}
                style={[
                  styles.recentBrandButton,
                  selectedBrand === brand && styles.selectedBrand,
                ]}
              />
            ))}
          </View>
        </View>
      )}
      
      <ThemedInput
        placeholder="Type brand name"
        value={customBrand}
        onChangeText={(text) => {
          setCustomBrand(text);
          if (onCustomBrand) onCustomBrand(text);
        }}
        style={styles.input}
      />

      <ScrollView style={styles.brandList}>
        {allBrands.map((brand) => (
          <ThemedButton
            key={brand}
            title={brand}
            onPress={() => {
              onSelect(brand);
              setCustomBrand('');
            }}
            style={[
              styles.brandButton,
              selectedBrand === brand && styles.selectedBrand,
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  brandList: {
    maxHeight: 200,
  },
  brandButton: {
    marginVertical: 4,
  },
  selectedBrand: {
    backgroundColor: '#4CAF50',
  },
  recentContainer: {
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recentBrands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentBrandButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
}); 