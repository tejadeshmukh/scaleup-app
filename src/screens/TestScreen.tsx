import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar';
import { Colors } from '../constants/theme';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <AppBar title="Test Screen" subtitle="Testing logout button" />
      <View style={styles.content}>
        <Text style={styles.text}>You should see the logout button in the top-right corner!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.text.primary,
  },
});
