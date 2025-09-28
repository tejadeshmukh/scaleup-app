import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useStore } from '../state/store';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface JoinRequestButtonProps {
  communityId: string;
  communityName: string;
  onJoin: () => void;
}

export default function JoinRequestButton({ communityId, communityName, onJoin }: JoinRequestButtonProps) {
  const { api, user } = useStore();
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRequestStatus();
  }, [communityId]);

  const checkRequestStatus = async () => {
    try {
      const status = await api.getJoinRequestStatus({ userId: user.id, communityId });
      setRequestStatus(status);
    } catch (error) {
      console.error('Error checking request status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (requestStatus === 'pending') return; // Don't allow multiple requests
    
    try {
      await onJoin();
      setRequestStatus('pending');
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  if (loading) {
    return (
      <TouchableOpacity style={[styles.button, styles.loadingButton]} disabled>
        <Text style={styles.buttonText}>Loading...</Text>
      </TouchableOpacity>
    );
  }

  if (requestStatus === 'pending') {
    return (
      <TouchableOpacity style={[styles.button, styles.pendingButton]} disabled>
        <Text style={styles.buttonText}>⏳ Request Pending</Text>
      </TouchableOpacity>
    );
  }

  if (requestStatus === 'approved') {
    return (
      <TouchableOpacity style={[styles.button, styles.approvedButton]} disabled>
        <Text style={styles.buttonText}>✅ Joined</Text>
      </TouchableOpacity>
    );
  }

  if (requestStatus === 'rejected') {
    return (
      <TouchableOpacity style={[styles.button, styles.rejectedButton]} onPress={handleJoin}>
        <Text style={styles.buttonText}>🔄 Request Again</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={handleJoin}>
      <Text style={styles.buttonText}>Join</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minWidth: 100,
  },
  joinButton: {
    backgroundColor: Colors.primary,
  },
  pendingButton: {
    backgroundColor: Colors.warning,
  },
  approvedButton: {
    backgroundColor: Colors.success,
  },
  rejectedButton: {
    backgroundColor: Colors.error,
  },
  loadingButton: {
    backgroundColor: Colors.text.light,
  },
  buttonText: {
    ...Typography.caption,
    color: Colors.text.white,
    fontWeight: '600',
  },
});
