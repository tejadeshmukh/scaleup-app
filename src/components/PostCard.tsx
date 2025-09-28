import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Post, Comment } from '../state/mockDB';
import { useStore } from '../state/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  communityName: string;
  onVote: (delta: number) => void;
  showComments?: boolean;
}

export default function PostCard({ post, communityName, onVote, showComments = true }: PostCardProps) {
  const { api, user, refresh } = useStore();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = post.likes.includes(user.id);
  const isCommentLiked = (comment: Comment) => comment.likes.includes(user.id);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await api.likePost({ postId: post.id, userId: user.id });
      await refresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      await api.likeComment({ commentId, userId: user.id });
      await refresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to like comment');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      await api.addComment({ postId: post.id, userId: user.id, text: commentText.trim() });
      setCommentText('');
      setShowCommentInput(false);
      await refresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const getUserName = (userId: string) => {
    // In a real app, you'd fetch user details
    return `User ${userId}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.communityName}>{communityName}</Text>
          <Text style={styles.authorName}>{getUserName(post.userId)}</Text>
        </View>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(post.ts, { addSuffix: true })}
        </Text>
      </View>
      
      <Text style={styles.content}>{post.text}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, isLiked && styles.likedButton]} 
          onPress={handleLike}
          disabled={isLiking}
        >
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {isLiked ? '❤️' : '🤍'} {post.likes.length}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setShowCommentInput(!showCommentInput)}
        >
          <Text style={styles.actionText}>💬 {post.comments.length}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => onVote(1)}>
          <Text style={styles.actionText}>▲ {post.up}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => onVote(-1)}>
          <Text style={styles.actionText}>▼ {post.down}</Text>
        </TouchableOpacity>
      </View>

      {showCommentInput && (
        <View style={styles.commentInput}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <View style={styles.commentActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCommentInput(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.postButton, !commentText.trim() && styles.disabledButton]} 
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showComments && post.comments.length > 0 && (
        <View style={styles.comments}>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{getUserName(comment.userId)}</Text>
                <Text style={styles.commentTime}>
                  {formatDistanceToNow(comment.ts, { addSuffix: true })}
                </Text>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
              <TouchableOpacity 
                style={styles.commentLikeButton}
                onPress={() => handleCommentLike(comment.id)}
              >
                <Text style={styles.commentLikeText}>
                  {isCommentLiked(comment) ? '❤️' : '🤍'} {comment.likes.length}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  communityName: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  authorName: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  timestamp: {
    ...Typography.small,
    color: Colors.text.light,
  },
  content: {
    ...Typography.body,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    alignItems: 'center',
  },
  likedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  likedText: {
    color: Colors.text.white,
  },
  commentInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentTextInput: {
    ...Typography.body,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: Spacing.sm,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  cancelText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  postButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  disabledButton: {
    backgroundColor: Colors.text.light,
  },
  postText: {
    ...Typography.caption,
    color: Colors.text.white,
    fontWeight: '600',
  },
  comments: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  comment: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  commentAuthor: {
    ...Typography.small,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  commentTime: {
    ...Typography.small,
    color: Colors.text.light,
  },
  commentText: {
    ...Typography.body,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  commentLikeButton: {
    alignSelf: 'flex-start',
  },
  commentLikeText: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
});