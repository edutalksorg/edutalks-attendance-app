import api from '@/services/api';
import React, { createContext, useEffect, useState } from 'react';

const ACCESS_KEY = 'hr_access_token';
const REFRESH_KEY = 'hr_refresh_token';

export const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const a = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
        if (a) {
          try {
            const { data } = await api.get('/api/v1/users/me');
            setUser(data);
          } catch (e) {
            localStorage.removeItem(ACCESS_KEY);
            localStorage.removeItem(REFRESH_KEY);
          }
        }
      } catch (e) {
        // ignore
      }
      setLoading(false);
    })();
  }, []);

  const login = async (emailOrCode: string, password: string) => {
    setLoading(true);
    const res = await api.post('/api/v1/auth/login', { emailOrEmployeeCode: emailOrCode, password });
    const access = res.data?.accessToken || res.data?.token || res.data?.access;
    const refresh = res.data?.refreshToken || res.data?.refresh;
    if (!access) throw new Error('No access token');
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    const { data } = await api.get('/api/v1/users/me');
    setUser(data);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
