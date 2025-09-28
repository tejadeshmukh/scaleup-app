import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius } from '../constants/theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: AnimatedButtonProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    if (disabled) baseStyle.push(styles.disabledButton);
    return baseStyle;
  };

  const getTextStyle = () => {
    return [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Text style={getTextStyle()}>
          {loading ? 'Loading...' : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  // Sizes
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  mdButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  lgButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  // States
  disabledButton: {
    backgroundColor: Colors.text.light,
    opacity: 0.6,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.text.white,
  },
  secondaryText: {
    color: Colors.text.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  // Text sizes
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
});
