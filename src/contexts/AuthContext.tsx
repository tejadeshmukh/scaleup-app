import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check for existing session on app start
  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }, 1000);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock authentication logic
    const isAdmin = credentials.email === 'xyz@iitb.ac.in';
    const user: User = {
      id: isAdmin ? 'u2' : 'u1', // Admin gets u2, others get u1
      name: credentials.email.split('@')[0],
      email: credentials.email,
      impact: isAdmin ? 100 : 0,
      badges: isAdmin ? ['Founder', 'Moderator'] : [],
      isAdmin,
      joinedAt: Date.now(),
    };

    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false,
    });

    return true;
  };

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isAdmin = credentials.email === 'xyz@iitb.ac.in';
    const user: User = {
      id: 'u1',
      name: credentials.name,
      email: credentials.email,
      impact: 0,
      badges: [],
      isAdmin,
      joinedAt: Date.now(),
    };

    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false,
    });

    return true;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  const isAdmin = (): boolean => {
    return authState.user?.isAdmin || false;
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
