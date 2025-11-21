import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.example.com';

const ACCESS_KEY = 'hr_access_token';
const REFRESH_KEY = 'hr_refresh_token';

const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v?: any) => void; reject: (e: any) => void; config: any }> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(p => {
		if (error) p.reject(error);
		else {
			if (p.config.headers) p.config.headers['Authorization'] = `Bearer ${token}`;
			p.resolve(api.request(p.config));
		}
	});
	failedQueue = [];
};

api.interceptors.request.use(config => {
	try {
		const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
		if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
	} catch (e) {
		// ignore
	}
	return config;
});

api.interceptors.response.use(
	r => r,
	async err => {
		const originalRequest = err.config;
		if (!originalRequest) return Promise.reject(err);

		const status = err.response?.status;
		const isRefresh = originalRequest.url?.includes('/api/v1/auth/refresh');

		if (status === 401 && !originalRequest._retry && !isRefresh) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => failedQueue.push({ resolve, reject, config: originalRequest }));
			}

			isRefreshing = true;
			try {
				const refreshToken = localStorage.getItem(REFRESH_KEY);
				if (!refreshToken) {
					localStorage.removeItem(ACCESS_KEY);
					throw new Error('No refresh token');
				}
				const resp = await axios.post(`${API_BASE}/api/v1/auth/refresh`, { refreshToken });
				const newAccess = resp.data?.accessToken || resp.data?.token || resp.data?.access;
				const newRefresh = resp.data?.refreshToken || refreshToken;
				if (newAccess) {
					localStorage.setItem(ACCESS_KEY, newAccess);
					localStorage.setItem(REFRESH_KEY, newRefresh);
					api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
					processQueue(null, newAccess);
					return api.request(originalRequest);
				}
			} catch (e) {
				localStorage.removeItem(ACCESS_KEY);
				localStorage.removeItem(REFRESH_KEY);
				processQueue(e, null);
				return Promise.reject(e);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(err);
	}
);

export default api;
