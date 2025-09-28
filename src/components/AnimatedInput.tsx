import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, BorderRadius } from '../constants/theme';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  error?: string;
}

export default function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.text.secondary, isFocused ? Colors.primary : Colors.text.secondary],
    }),
    fontWeight: '500' as const,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.errorContainer]}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor={Colors.text.light}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    minHeight: 56,
    justifyContent: 'center',
  },
  errorContainer: {
    borderColor: Colors.error,
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
