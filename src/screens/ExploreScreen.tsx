import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useStore } from '../state/store';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '../components/AppBar';
import PostCard from '../components/PostCard';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Post, Community } from '../state/mockDB';

export default function ExploreScreen() {
  const { communities, api, refresh, user } = useStore();
  const { isAdmin } = useAuth();
  const [allPosts, setAllPosts] = useState<Array<Post & { community: Community }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [communities]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const joinedCommunities = communities.filter(c => c.members.includes(user.id));
      const posts: Array<Post & { community: Community }> = [];
      
      joinedCommunities.forEach(community => {
        community.posts.forEach(post => {
          posts.push({ ...post, community });
        });
      });
      
      // Sort by timestamp (newest first)
      posts.sort((a, b) => b.ts - a.ts);
      setAllPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (communityId: string, postId: string, delta: number) => {
    try {
      await api.votePost({ communityId, postId, delta });
      await refresh();
      await loadPosts(); // Reload posts to get updated counts
    } catch (error) {
      Alert.alert('Error', 'Failed to vote on post');
    }
  };

  const handleCreatePost = () => {
    Alert.alert(
      'Create New Post',
      'Select a community to post in:',
      communities
        .filter(c => c.members.includes(user.id))
        .map(community => ({
          text: community.name,
          onPress: () => showPostInput(community)
        }))
        .concat([{ text: 'Cancel', onPress: () => {} }])
    );
  };

  const showPostInput = (community: Community) => {
    Alert.prompt(
      `New Post in ${community.name}`,
      'What would you like to share?',
      async (text) => {
        if (!text?.trim()) return;
        
        try {
          await api.createPost({ communityId: community.id, userId: user.id, text: text.trim() });
          await refresh();
          await loadPosts();
          Alert.alert('Success', 'Post created successfully!');
        } catch (error) {
          Alert.alert('Error', 'Failed to create post');
        }
      }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar title="Explore" subtitle="Loading posts..." />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar 
        title="Explore" 
        subtitle={`${allPosts.length} posts from your communities`}
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Latest Posts</Text>
          <Text style={styles.subtitle}>
            Discover what's happening in your communities
          </Text>
        </View>

        <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
          <Text style={styles.createPostText}>✍️ Create New Post</Text>
        </TouchableOpacity>

        {allPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
              Join some communities to see posts here, or create your first post!
            </Text>
            <TouchableOpacity style={styles.joinButton} onPress={() => {}}>
              <Text style={styles.joinButtonText}>Browse Communities</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={allPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                communityName={item.community.name}
                onVote={(delta) => handleVote(item.community.id, item.id, delta)}
                showComments={true}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  createPostButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  createPostText: {
    ...Typography.body,
    color: Colors.text.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  joinButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  joinButtonText: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
});