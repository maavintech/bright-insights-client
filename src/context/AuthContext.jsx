import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('bi_admin');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('bi_admin_token', data.token);
    localStorage.setItem('bi_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bi_admin_token');
    localStorage.removeItem('bi_admin');
    setAdmin(null);
  }, []);

  const isAuthenticated = !!admin && !!localStorage.getItem('bi_admin_token');

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
