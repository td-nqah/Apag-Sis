// ==========================================================================
// APAG Auth Context & Hook
// ==========================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = AuthService.getSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean = true) => {
    const res = await AuthService.login(username, password);
    if (res.data) {
      setUser(res.data);
      AuthService.setSession(res.data, rememberMe);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Đăng nhập không thành công' };
  };

  const logout = () => {
    AuthService.clearSession();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    AuthService.setSession(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
