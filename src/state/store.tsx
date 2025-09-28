import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User, Community, Notification } from './mockDB';
import { useAuth } from '../contexts/AuthContext';

interface StoreContextType {
  user: User;
  communities: Community[];
  setCommunities: (communities: Community[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  loading: boolean;
  refresh: () => Promise<void>;
  api: typeof api;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  
  // Create a mock user object that matches the authenticated user
  const user: User = {
    id: authUser?.id || 'u1',
    name: authUser?.name || 'User',
    impact: authUser?.impact || 0,
    badges: authUser?.badges || [],
  };

  const refresh = async () => {
    setLoading(true);
    const list = await api.listCommunities();
    const notifs = await api.listNotifications();
    setCommunities(list);
    setNotifications(notifs);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const value: StoreContextType = {
    user,
    communities,
    setCommunities,
    notifications,
    setNotifications,
    loading,
    refresh,
    api,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
