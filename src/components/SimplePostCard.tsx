import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post } from '../state/mockDB';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface SimplePostCardProps {
  post: Post;
  communityName: string;
}

export default function SimplePostCard({ post, communityName }: SimplePostCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.communityName}>{communityName}</Text>
      <Text style={styles.content}>{post.text}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>▲ {post.up} ▼ {post.down}</Text>
        <Text style={styles.metaText}>💬 {post.comments.length}</Text>
        <Text style={styles.metaText}>❤️ {post.likes.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  communityName: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  content: {
    ...Typography.body,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metaText: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
});
