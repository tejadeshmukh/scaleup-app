import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SimpleCommunitiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScaleUp Communities</Text>
      <Text style={styles.subtitle}>Community platform is loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FAFC',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#08313B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B6A75',
  },
});
