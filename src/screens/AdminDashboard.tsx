import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../state/store';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '../components/AppBar';
import AnimatedButton from '../components/AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { JoinRequest, Community, User } from '../state/mockDB';

export default function AdminDashboard() {
  const { api, refresh, communities } = useStore();
  const { user } = useAuth();
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJoinRequests();
  }, []);

  const loadJoinRequests = async () => {
    try {
      const requests = await api.listJoinRequests();
      setJoinRequests(requests);
    } catch (error) {
      console.error('Error loading join requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await api.approveJoinRequest({ requestId });
      await loadJoinRequests();
      await refresh();
      Alert.alert('Success', 'Join request approved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve join request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await api.rejectJoinRequest({ requestId });
      await loadJoinRequests();
      Alert.alert('Success', 'Join request rejected');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject join request');
    }
  };

  const getCommunityName = (communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    return community ? community.name : 'Unknown Community';
  };

  const getUserName = (userId: string) => {
    // For now, return a placeholder. In a real app, you'd fetch user details
    return `User ${userId}`;
  };

  return (
    <View style={styles.container}>
      <AppBar 
        title="Admin Dashboard" 
        subtitle={`${joinRequests.length} pending requests`}
      />
      <View style={styles.scrollContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Admin Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{joinRequests.length}</Text>
              <Text style={styles.statLabel}>Pending Requests</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Total Communities</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Join Requests</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : joinRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No pending requests</Text>
            <Text style={styles.emptySubtext}>All caught up! 🎉</Text>
          </View>
        ) : (
          <FlatList
            data={joinRequests}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestTitle}>
                    {getUserName(item.userId)} wants to join {getCommunityName(item.communityId)}
                  </Text>
                  <Text style={styles.requestTime}>
                    {new Date(item.ts).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.requestActions}>
                  <AnimatedButton
                    title="Approve"
                    onPress={() => handleApprove(item.id)}
                    variant="primary"
                    size="sm"
                    style={styles.approveButton}
                  />
                  <AnimatedButton
                    title="Reject"
                    onPress={() => handleReject(item.id)}
                    variant="outline"
                    size="sm"
                    style={styles.rejectButton}
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
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
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  statsTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.text.light,
  },
  requestCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  requestHeader: {
    marginBottom: Spacing.md,
  },
  requestTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  requestTime: {
    ...Typography.small,
    color: Colors.text.light,
  },
  requestActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
  },
});
