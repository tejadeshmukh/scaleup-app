import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../state/store';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '../components/AppBar';
import { formatDistanceToNow } from 'date-fns';
import { Colors, Typography, Spacing } from '../constants/theme';

export default function NotificationsScreen() {
  const { notifications } = useStore();
  const { isAdmin } = useAuth();
  
  return (
    <View style={styles.container}>
      <AppBar 
        title="Notifications" 
        subtitle={`${notifications.length} new notifications`}
      />
      <ScrollView style={styles.scrollContainer}>
        <FlatList
          data={notifications}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.dot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.time}>
                  {formatDistanceToNow(item.ts, { addSuffix: true })}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
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
  row: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 10, 
    backgroundColor: Colors.accent, 
    marginTop: 8 
  },
  text: { 
    ...Typography.body, 
    fontWeight: '700' 
  },
  time: { 
    ...Typography.small, 
    color: Colors.text.light 
  },
  empty: { 
    ...Typography.body, 
    color: Colors.text.light, 
    marginTop: 20, 
    textAlign: 'center' 
  },
});
