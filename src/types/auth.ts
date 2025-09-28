export interface User {
  id: string;
  name: string;
  email: string;
  impact: number;
  badges: string[];
  isAdmin: boolean;
  joinedAt: number;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
