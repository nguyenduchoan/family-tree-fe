import client from './client';
import type { User } from '../types';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const authApi = {
    register: async (data: any) => {
        const response = await client.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: any) => {
        const response = await client.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    getMe: async () => {
        const response = await client.get<User>('/auth/me');
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    }
};
