import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001/api';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token (simplified for now)
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if it's a login error (don't retry locally)
            if (originalRequest.url.includes('/auth/login')) {
                return Promise.reject(error);
            }

            // TODO: Implement refresh token flow
            // For now, logout on 401
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;
