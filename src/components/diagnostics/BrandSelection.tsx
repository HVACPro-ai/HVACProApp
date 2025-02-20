import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedButton } from '../ThemedComponents';

interface Props {
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
}

const BRANDS = ['Carrier', 'Trane', 'Lennox', 'Rheem', 'York', 'Other'];

export const BrandSelection: React.FC<Props> = ({ selectedBrand, onBrandSelect }) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Select Equipment Brand</ThemedText>
      <View style={styles.grid}>
        {BRANDS.map((brand) => (
          <ThemedButton
            key={brand}
            title={brand}
            onPress={() => onBrandSelect(brand)}
            style={[
              styles.brandButton,
              selectedBrand === brand && styles.selectedBrand,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  brandButton: {
    margin: 4,
    minWidth: 100,
  },
  selectedBrand: {
    backgroundColor: '#007AFF',
  },
}); 