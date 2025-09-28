import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useStore } from '../state/store';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '../components/AppBar';
import CommunityCard from '../components/CommunityCard';
import PostCard from '../components/PostCard';
import CommunityTypeSelector from '../components/CommunityTypeSelector';
import ParentCommunitySelector from '../components/ParentCommunitySelector';
import JoinRequestButton from '../components/JoinRequestButton';
import AnimatedButton from '../components/AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function CommunitiesScreen() {
  const { communities, api, refresh, user } = useStore();
  const { isAdmin } = useAuth();
  const parents = useMemo(() => communities.filter(c => !c.parentId), [communities]);
  const children = useMemo(() => communities.filter(c => c.parentId), [communities]);
  
  // Form state
  const [name, setName] = useState('');
  const [communityType, setCommunityType] = useState<'parent' | 'child'>('parent');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const create = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a community name');
      return;
    }
    
    if (communityType === 'child' && !selectedParentId) {
      Alert.alert('Error', 'Please select a parent community');
      return;
    }
    
    setIsCreating(true);
    try {
      const parentId = communityType === 'child' ? selectedParentId : null;
      const newCommunity = await api.createCommunity({ name: name.trim(), parentId });
      
      console.log('Created community:', newCommunity);
      
      // Reset form
      setName('');
      setCommunityType('parent');
      setSelectedParentId(null);
      
      // Force refresh the communities list
      await refresh();
      
      Alert.alert('Success', `Community "${name.trim()}" created successfully!`);
    } catch (error) {
      console.error('Error creating community:', error);
      Alert.alert('Error', 'Failed to create community. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const join = async (c: any) => {
    await api.joinCommunity({ userId: user.id, communityId: c.id });
    refresh();
  };

  const autoJoin = async (c: any) => {
    await api.autoJoinChild({ userId: user.id, parentId: c.id });
    refresh();
  };

  const openCommunity = (c: any) => {
    Alert.prompt('New Post in ' + c.name, 'What would you like to share?', async (text) => {
      if (!text?.trim()) return;
      try {
        await api.createPost({ communityId: c.id, userId: user.id, text: text.trim() });
        await refresh();
        Alert.alert('Success', 'Post created successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to create post');
      }
    });
  };

  const handleVote = async (communityId: string, postId: string, delta: number) => {
    await api.votePost({ communityId, postId, delta });
    refresh();
  };

  return (
    <View style={styles.container}>
      <AppBar 
        title="Communities" 
        subtitle={isAdmin() ? 'Create and manage communities' : 'Join communities and participate'}
      />
            <ScrollView style={styles.scrollContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.welcomeTitle}>Welcome to IITB Communities! 🎓</Text>
              <Text style={styles.welcomeSubtitle}>
                Connect, share, and engage with your fellow students
              </Text>
            </View>

            {/* Create Community Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Create New Community</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Community name (e.g., Hostel 8, CS Department)"
          value={name}
          onChangeText={setName}
        />
        
        <CommunityTypeSelector
          selectedType={communityType}
          onTypeChange={setCommunityType}
        />
        
        {communityType === 'child' && (
          <ParentCommunitySelector
            communities={communities}
            selectedParentId={selectedParentId}
            onParentSelect={setSelectedParentId}
          />
        )}
        
        <AnimatedButton
          title="Create Community"
          onPress={create}
          loading={isCreating}
          disabled={!name.trim()}
          style={styles.createButton}
        />
      </View>

      <Text style={styles.section}>Parent communities</Text>
      <FlatList
        data={parents}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View>
            <CommunityCard item={item} onPress={() => openCommunity(item)} />
            <View style={styles.row}>
              {isAdmin() ? (
                <>
                  <TouchableOpacity style={styles.smallBtn} onPress={() => join(item)}>
                    <Text style={styles.smallText}>Join</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: '#00D1B2' }]}
                    onPress={() => autoJoin(item)}
                  >
                    <Text style={[styles.smallText, { color: '#042a2a' }]}>Auto-Join Child</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.smallBtn} onPress={() => join(item)}>
                  <Text style={styles.smallText}>Request to Join</Text>
                </TouchableOpacity>
              )}
            </View>
            {item.posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                communityName={item.name}
                onVote={(delta) => handleVote(item.id, post.id, delta)}
              />
            ))}
          </View>
        )}
      />

      <Text style={styles.section}>Sub-communities</Text>
      <FlatList
        data={children}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View>
            <CommunityCard item={item} onPress={() => openCommunity(item)} />
            <View style={styles.row}>
              {isAdmin() ? (
                <TouchableOpacity style={styles.smallBtn} onPress={() => join(item)}>
                  <Text style={styles.smallText}>Join</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.smallBtn} onPress={() => join(item)}>
                  <Text style={styles.smallText}>Request to Join</Text>
                </TouchableOpacity>
              )}
            </View>
            {item.posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                communityName={item.name}
                onVote={(delta) => handleVote(item.id, post.id, delta)}
              />
            ))}
          </View>
        )}
      />
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
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  formTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Typography.body,
  },
  createButton: {
    marginTop: Spacing.sm,
  },
  section: { 
    ...Typography.h3, 
    marginTop: Spacing.md, 
    marginBottom: Spacing.sm 
  },
  row: { 
    flexDirection: 'row', 
    gap: Spacing.sm, 
    marginBottom: Spacing.sm 
  },
  smallBtn: { 
    backgroundColor: Colors.primary, 
    paddingVertical: Spacing.sm, 
    paddingHorizontal: Spacing.md, 
    borderRadius: BorderRadius.md 
  },
        smallText: { 
          color: Colors.text.white, 
          fontWeight: '600' 
        },
        headerSection: {
          backgroundColor: Colors.primary,
          borderRadius: BorderRadius.lg,
          padding: Spacing.lg,
          marginBottom: Spacing.lg,
          ...Shadows.lg,
        },
        welcomeTitle: {
          ...Typography.h2,
          color: Colors.text.white,
          marginBottom: Spacing.sm,
          textAlign: 'center',
        },
        welcomeSubtitle: {
          ...Typography.body,
          color: Colors.text.white,
          opacity: 0.9,
          textAlign: 'center',
          lineHeight: 22,
        },
        noPostsContainer: {
          backgroundColor: Colors.background,
          borderRadius: BorderRadius.md,
          padding: Spacing.md,
          marginTop: Spacing.sm,
          alignItems: 'center',
        },
        noPostsText: {
          ...Typography.body,
          color: Colors.text.secondary,
          fontStyle: 'italic',
        },
        testPost: {
          backgroundColor: Colors.surface,
          borderRadius: BorderRadius.md,
          padding: Spacing.sm,
          marginTop: Spacing.sm,
          borderWidth: 1,
          borderColor: Colors.border,
        },
        testPostText: {
          ...Typography.body,
          marginBottom: Spacing.xs,
        },
        testPostMeta: {
          ...Typography.small,
          color: Colors.text.secondary,
        },
      });
