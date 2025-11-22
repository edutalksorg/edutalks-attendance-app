import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = process.env.API_BASE_URL || 'https://api.example.com';

const ACCESS_KEY = '@hr:accessToken';
const REFRESH_KEY = '@hr:refreshToken';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  try {
    const token = await AsyncStorage.getItem(ACCESS_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export const setTokens = async (accessToken: string, refreshToken?: string | null) => {
  await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) {
    await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
  }
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem(ACCESS_KEY);
  await AsyncStorage.removeItem(REFRESH_KEY);
};

export default api;
