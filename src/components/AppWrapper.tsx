import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import LoadingScreen from './LoadingScreen';
import { Colors } from '../constants/theme';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <View style={{ flex: 1, backgroundColor: Colors.background }}>{children}</View>;
}
