import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE = process.env.API_BASE_URL || 'https://api.example.com';

const ACCESS_KEY = '@hr:accessToken';
const REFRESH_KEY = '@hr:refreshToken';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) {
      p.reject(error);
    } else {
      if (p.config.headers) p.config.headers.Authorization = `Bearer ${token}`;
      p.resolve(api.request(p.config));
    }
  });
  failedQueue = [];
};

const getAccessToken = async () => AsyncStorage.getItem(ACCESS_KEY);
const getRefreshToken = async () => AsyncStorage.getItem(REFRESH_KEY);

export const setTokens = async (accessToken: string, refreshToken?: string) => {
  await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem(ACCESS_KEY);
  await AsyncStorage.removeItem(REFRESH_KEY);
};

api.interceptors.request.use(async config => {
  try {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  r => r,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const isRefreshEndpoint = originalRequest.url?.includes('/api/v1/auth/refresh');

    if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          await clearTokens();
          isRefreshing = false;
          processQueue(new Error('No refresh token'));
          return Promise.reject(error);
        }

        const resp = await axios.post(`${API_BASE}/api/v1/auth/refresh`, { refreshToken });
        const newAccess = resp.data?.accessToken || resp.data?.token || resp.data?.access;
        const newRefresh = resp.data?.refreshToken || refreshToken;
        if (newAccess) {
          await setTokens(newAccess, newRefresh);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          processQueue(null, newAccess);
          return api.request(originalRequest);
        }
      } catch (err) {
        await clearTokens();
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
