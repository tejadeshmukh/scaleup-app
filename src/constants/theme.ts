// IITB-Inspired Design System
export const Colors = {
  primary: '#08313B',      // Deep teal
  secondary: '#00D1B2',    // Bright teal
  accent: '#FFC107',       // Gold
  background: '#F4FAFC',   // Light blue-gray
  surface: '#FFFFFF',      // White
  text: {
    primary: '#08313B',    // Dark teal
    secondary: '#4B6A75',  // Medium gray
    light: '#5B7A86',      // Light gray
    white: '#FFFFFF',      // White
  },
  border: '#E2EDF1',       // Light border
  success: '#4CAF50',      // Green
  error: '#F44336',        // Red
  warning: '#FF9800',      // Orange
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text.primary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text.secondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.text.light,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
