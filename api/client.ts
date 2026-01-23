import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001/api';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
client.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                // console.log('Attaching token to request:', config.url);
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.warn('No token found for request:', config.url);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if it's a login error (don't retry locally)
            if (originalRequest.url.includes('/auth/login')) {
                return Promise.reject(error);
            }

            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
