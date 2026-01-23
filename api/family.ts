import client from './client';
import type { Family, FamilyMemberUser } from '../types';

export const familyApi = {
    getMyFamilies: async () => {
        const response = await client.get<Family[]>('/families');
        return response.data;
    },

    getFamily: async (id: string) => {
        const response = await client.get<Family>(`/families/${id}`);
        return response.data;
    },

    createFamily: async (data: { name: string; description?: string }) => {
        const response = await client.post<Family>('/families', data);
        return response.data;
    },

    updateFamily: async (id: string, data: { name: string; description?: string }) => {
        const response = await client.put<Family>(`/families/${id}`, data);
        return response.data;
    },

    deleteFamily: async (id: string) => {
        await client.delete(`/families/${id}`);
    },

    createInvitation: async (familyId: string) => {
        const response = await client.post<string>(`/families/${familyId}/invitations`);
        return response.data;
    },

    joinFamily: async (token: string) => {
        const response = await client.post<Family>(`/families/join`, null, {
            params: { token }
        });
        return response.data;
    },

    getFamilyMembers: async (familyId: string) => {
        const response = await client.get<FamilyMemberUser[]>(`/families/${familyId}/users`);
        return response.data;
    },

    leaveFamily: async (familyId: string) => {
        await client.delete(`/families/${familyId}/leave`);
    },

    removeMember: async (familyId: string, userId: string) => {
        await client.delete(`/families/${familyId}/users/${userId}`);
    },

    updateMemberRole: async (familyId: string, userId: string, role: 'OWNER' | 'EDITOR' | 'VIEWER') => {
        await client.put(`/families/${familyId}/users/${userId}/role`, null, {
            params: { role }
        });
    },

    generateShareToken: async (familyId: string) => {
        const response = await client.post<string>(`/families/${familyId}/share`);
        return response.data;
    },

    getFamilyByShareToken: async (token: string) => {
        const response = await client.get<{ family: Family, members: any[], token: string }>(`/share/${token}`);
        return response.data;
    },

    joinFamilyByShareToken: async (token: string) => {
        const response = await client.post<Family>(`/share/${token}/join`);
        return response.data;
    }
};
