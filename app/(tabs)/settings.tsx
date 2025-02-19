import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/context/ThemeContext';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Appearance',
      settings: [
        {
          title: 'Dark Mode',
          type: 'switch',
          value: isDark,
          onValueChange: toggleTheme
        }
      ]
    },
    {
      title: 'Notifications',
      settings: [
        {
          title: 'Service Reminders',
          type: 'switch',
          value: true,
          onValueChange: () => {}
        },
        {
          title: 'Inventory Alerts',
          type: 'switch',
          value: true,
          onValueChange: () => {}
        }
      ]
    },
    {
      title: 'App Info',
      settings: [
        {
          title: 'Version',
          type: 'info',
          value: '1.0.0'
        },
        {
          title: 'Terms of Service',
          type: 'link',
          onPress: () => {}
        },
        {
          title: 'Privacy Policy',
          type: 'link',
          onPress: () => {}
        }
      ]
    }
  ];

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'switch':
        return (
          <View style={styles.settingRow} key={setting.title}>
            <ThemedText>{setting.title}</ThemedText>
            <Switch
              value={setting.value}
              onValueChange={setting.onValueChange}
            />
          </View>
        );
      case 'info':
        return (
          <View style={styles.settingRow} key={setting.title}>
            <ThemedText>{setting.title}</ThemedText>
            <ThemedText style={styles.infoText}>{setting.value}</ThemedText>
          </View>
        );
      case 'link':
        return (
          <View style={styles.settingRow} key={setting.title}>
            <ThemedText 
              style={styles.linkText}
              onPress={setting.onPress}
            >
              {setting.title}
            </ThemedText>
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText style={styles.title}>Settings</ThemedText>
        
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <View style={styles.sectionContent}>
              {section.settings.map((setting) => renderSetting(setting))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoText: {
    color: '#666',
  },
  linkText: {
    color: '#007AFF',
  },
}); 