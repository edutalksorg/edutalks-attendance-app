import api, { clearTokens, setTokens } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

type Role = 'EMPLOYEE' | 'HR' | 'ADMIN';

type User = {
  id: string;
  fullName?: string;
  email?: string;
  role?: Role;
  [key: string]: any;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};

type AuthContextType = AuthState & {
  login: (emailOrCode: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  requestOtp: (identifier: string) => Promise<void>;
  verifyOtp: (identifier: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  requestOtp: async () => {},
  verifyOtp: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

const ACCESS_KEY = '@hr:accessToken';
const REFRESH_KEY = '@hr:refreshToken';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const a = await AsyncStorage.getItem(ACCESS_KEY);
        const r = await AsyncStorage.getItem(REFRESH_KEY);
        if (a) {
          setAccessToken(a);
          setRefreshToken(r);
          try {
            const { data } = await api.get('/api/v1/users/me');
            setUser(data);
          } catch (e) {
            await clearTokens();
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
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
    if (!access) throw new Error('No access token returned');
    await setTokens(access, refresh);
    setAccessToken(access);
    setRefreshToken(refresh || null);
    const { data } = await api.get('/api/v1/users/me');
    setUser(data);
    setLoading(false);
  };

  const register = async payload => {
    setLoading(true);
    await api.post('/api/v1/auth/register', payload);
    setLoading(false);
  };

  const requestOtp = async (identifier: string) => {
    setLoading(true);
    await api.post('/api/v1/auth/request-otp', { identifier });
    setLoading(false);
  };

  const verifyOtp = async (identifier: string, otp: string) => {
    setLoading(true);
    const res = await api.post('/api/v1/auth/verify-otp', { identifier, otp });
    const access = res.data?.accessToken || res.data?.token || res.data?.access;
    const refresh = res.data?.refreshToken || res.data?.refresh;
    if (!access) throw new Error('No access token returned');
    await setTokens(access, refresh);
    setAccessToken(access);
    setRefreshToken(refresh || null);
    const { data } = await api.get('/api/v1/users/me');
    setUser(data);
    setLoading(false);
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    await api.post('/api/v1/auth/forgot-password', { email });
    setLoading(false);
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    setLoading(true);
    await api.post('/api/v1/auth/reset-password', { resetToken, newPassword });
    setLoading(false);
  };

  const logout = async () => {
    await clearTokens();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const refreshProfile = async () => {
    try {
      const { data } = await api.get('/api/v1/users/me');
      setUser(data);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        loading,
        login,
        register,
        requestOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        logout,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
