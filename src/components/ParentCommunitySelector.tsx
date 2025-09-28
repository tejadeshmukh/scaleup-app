import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Typography, BorderRadius } from '../constants/theme';
import { Community } from '../state/mockDB';

interface ParentCommunitySelectorProps {
  communities: Community[];
  selectedParentId: string | null;
  onParentSelect: (parentId: string | null) => void;
}

export default function ParentCommunitySelector({ 
  communities, 
  selectedParentId, 
  onParentSelect 
}: ParentCommunitySelectorProps) {
  const parentCommunities = communities.filter(c => !c.parentId);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Parent Community</Text>
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.option, selectedParentId === null && styles.selectedOption]}
          onPress={() => onParentSelect(null)}
        >
          <Text style={[styles.optionText, selectedParentId === null && styles.selectedText]}>
            🆕 Create New Parent
          </Text>
        </TouchableOpacity>
        
        {parentCommunities.map(parent => (
          <TouchableOpacity
            key={parent.id}
            style={[styles.option, selectedParentId === parent.id && styles.selectedOption]}
            onPress={() => onParentSelect(parent.id)}
          >
            <Text style={[styles.optionText, selectedParentId === parent.id && styles.selectedText]}>
              📁 {parent.name}
            </Text>
            <Text style={styles.optionSubtext}>{parent.members.length} members</Text>
          </TouchableOpacity>
        ))}
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
    gap: 8,
  },
  option: {
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
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
  },
});
