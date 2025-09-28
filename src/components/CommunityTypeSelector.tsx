import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, BorderRadius } from '../constants/theme';

interface CommunityTypeSelectorProps {
  selectedType: 'parent' | 'child';
  onTypeChange: (type: 'parent' | 'child') => void;
}

export default function CommunityTypeSelector({ selectedType, onTypeChange }: CommunityTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Community Type</Text>
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.option, selectedType === 'parent' && styles.selectedOption]}
          onPress={() => onTypeChange('parent')}
        >
          <Text style={[styles.optionText, selectedType === 'parent' && styles.selectedText]}>
            🏛️ Parent Community
          </Text>
          <Text style={styles.optionSubtext}>Main community (e.g., IITB General)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.option, selectedType === 'child' && styles.selectedOption]}
          onPress={() => onTypeChange('child')}
        >
          <Text style={[styles.optionText, selectedType === 'child' && styles.selectedText]}>
            🏠 Sub-Community
          </Text>
          <Text style={styles.optionSubtext}>Child of existing community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text.primary,
  },
  selector: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  optionText: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedText: {
    color: Colors.primary,
  },
  optionSubtext: {
    ...Typography.small,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
