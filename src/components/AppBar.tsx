import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface AppBarProps {
  title: string;
  subtitle?: string;
  showUser?: boolean;
}

export default function AppBar({ title, subtitle, showUser = true }: AppBarProps) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>IITB</Text>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        {showUser && user && (
          <View style={styles.rightSection}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              {user.isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>ADMIN</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 50, // Status bar height
    paddingBottom: Spacing.md,
    ...Shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.text.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  logoText: {
    ...Typography.caption,
    fontWeight: '800',
    color: Colors.primary,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.white,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.text.white,
    opacity: 0.8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    ...Typography.caption,
    color: Colors.text.white,
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  adminText: {
    ...Typography.small,
    color: Colors.text.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  logoutBtn: {
    backgroundColor: Colors.text.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  logoutText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});
