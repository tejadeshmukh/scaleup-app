import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../state/store';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '../components/AppBar';
import AdminDashboard from './AdminDashboard';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function ProfileScreen() {
  const { user, communities } = useStore();
  const { isAdmin } = useAuth();
  const [showAdminDashboard, setShowAdminDashboard] = React.useState(false);
  
  const myPosts = communities.flatMap(c =>
    c.posts
      .filter(p => p.userId === user.id)
      .map(p => ({ ...p, community: c.name }))
  );

  if (showAdminDashboard) {
    return <AdminDashboard />;
  }

  return (
    <View style={styles.container}>
      <AppBar 
        title="Profile" 
        subtitle={`${myPosts.length} posts • ${user.impact || 0} impact points`}
      />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.kpi}>
            Impact Points: <Text style={{ color: Colors.primary, fontWeight: '800' }}>{user.impact || 0}</Text>
          </Text>
          <Text style={styles.badge}>
            Badges: {user.badges?.length ? user.badges.join(', ') : '—'}
          </Text>
          {isAdmin() && (
            <TouchableOpacity 
              style={styles.adminBadge}
              onPress={() => setShowAdminDashboard(true)}
            >
              <Text style={styles.adminText}>🔑 ADMIN DASHBOARD</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.section}>Your Posts</Text>
        <FlatList
          data={myPosts}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text style={styles.pTitle}>{item.text}</Text>
              <Text style={styles.pMeta}>
                {item.community} • ▲{item.up} ▼{item.down}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>You haven't posted yet. Join a community and post!</Text>
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scrollContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  name: { 
    ...Typography.h2, 
    marginBottom: Spacing.sm 
  },
  kpi: { 
    ...Typography.body, 
    color: Colors.text.secondary, 
    marginBottom: Spacing.sm 
  },
  badge: { 
    ...Typography.body, 
    color: Colors.text.secondary, 
    marginBottom: Spacing.sm 
  },
  adminBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  adminText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  section: { 
    ...Typography.h3, 
    marginTop: Spacing.md, 
    marginBottom: Spacing.sm 
  },
  post: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  pTitle: { 
    ...Typography.body, 
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  pMeta: { 
    ...Typography.small, 
    color: Colors.text.light 
  },
  empty: { 
    ...Typography.body, 
    color: Colors.text.light, 
    marginTop: Spacing.xl, 
    textAlign: 'center' 
  },
});
