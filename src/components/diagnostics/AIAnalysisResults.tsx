import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export interface AIAnalysisResult {
  diagnosis: string;
  recommendations: string[];
  partSuggestions?: string[];
  confidence: number;
  optimizations: {
    potentialSavings: {
      costPerMonth: number;
      energyPercent: number;
    };
  };
  imageAnalysis?: {
    findings: string[];
    confidence: number;
  };
}

export interface Props {
  results: AIAnalysisResult;
  onPartOrder: () => void;
}

export const AIAnalysisResults: React.FC<Props> = ({ results, onPartOrder }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#007AFF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>AI Diagnosis</ThemedText>
        <View style={styles.diagnosisCard}>
          <ThemedText style={styles.diagnosis}>{results.diagnosis}</ThemedText>
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceBar}>
              <Animated.View 
                style={[
                  styles.confidenceFill,
                  { width: `${results.confidence * 100}%` }
                ]} 
              />
            </View>
            <ThemedText style={styles.confidenceText}>
              {Math.round(results.confidence * 100)}% Confidence
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Root Causes</ThemedText>
        {results.recommendations.map((cause, index) => (
          <View key={index} style={styles.causeItem}>
            <Ionicons name="analytics-outline" size={24} color="#007AFF" />
            <ThemedText style={styles.causeText}>{cause}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recommended Actions</ThemedText>
        <View style={styles.timelineContainer}>
          {results.recommendations.length > 0 && (
            <View style={styles.timelineSection}>
              <ThemedText style={[styles.timelineTitle, { color: '#FF3B30' }]}>
                Immediate
              </ThemedText>
              {results.recommendations.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                  <ThemedText style={styles.actionText}>{action}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {results.partSuggestions && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Part Suggestions</ThemedText>
          {results.partSuggestions.map((suggestion, index) => (
            <View key={index} style={styles.partSuggestionItem}>
              <Ionicons name="build" size={24} color="#007AFF" />
              <ThemedText style={styles.partSuggestionText}>{suggestion}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {results.optimizations && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Potential Savings</ThemedText>
          <View style={styles.savingsCard}>
            <ThemedText style={styles.savingsAmount}>
              ${results.optimizations.potentialSavings.costPerMonth}/month
            </ThemedText>
            <ThemedText style={styles.savingsPercent}>
              {results.optimizations.potentialSavings.energyPercent}% Energy Reduction
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  diagnosisCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  diagnosis: {
    fontSize: 16,
    marginBottom: 12,
  },
  confidenceContainer: {
    marginTop: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  causeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  causeText: {
    marginLeft: 12,
    flex: 1,
  },
  timelineContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#e9ecef',
    paddingLeft: 16,
  },
  timelineSection: {
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  savingsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
  },
  savingsPercent: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  partSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  partSuggestionText: {
    marginLeft: 12,
    flex: 1,
  },
}); 