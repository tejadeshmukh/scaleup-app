import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let success = false;
      
      if (isLogin) {
        success = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        success = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      if (success) {
        Alert.alert(
          'Welcome!',
          isLogin ? 'Successfully logged in!' : 'Account created successfully!',
          [{ text: 'Continue', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back!' : 'Join ScaleUp'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue to your communities'
                : 'Create your account to get started'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <AnimatedInput
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                error={errors.name}
              />
            )}

            <AnimatedInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
            />

            <AnimatedInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            <AnimatedButton
              title={isLogin ? 'Sign In' : 'Create Account'}
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Text style={styles.linkText} onPress={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </View>

          {/* Admin Hint */}
          <View style={styles.adminHint}>
            <Text style={styles.hintText}>
              💡 Use 'xyz@iitb.ac.in' for admin access
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  adminHint: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintText: {
    ...Typography.small,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
