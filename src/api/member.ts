import client from './client';
import type { FamilyMember, CreateMemberRequest } from '../types';

export const memberApi = {
    getAllMembers: async (familyId: string) => {
        const response = await client.get<FamilyMember[]>(`/families/${familyId}/members`);
        return response.data;
    },

    getMember: async (familyId: string, memberId: string) => {
        const response = await client.get<FamilyMember>(`/families/${familyId}/members/${memberId}`);
        return response.data;
    },

    createMember: async (familyId: string, data: CreateMemberRequest) => {
        const response = await client.post<FamilyMember>(`/families/${familyId}/members`, data);
        return response.data;
    },

    updateMember: async (familyId: string, memberId: string, data: CreateMemberRequest) => {
        const response = await client.put<FamilyMember>(`/families/${familyId}/members/${memberId}`, data);
        return response.data;
    },

    deleteMember: async (familyId: string, memberId: string) => {
        await client.delete(`/families/${familyId}/members/${memberId}`);
    },

    // Relationships
    addRelationship: async (familyId: string, fromMemberId: string, toMemberId: string, type: 'SPOUSE' | 'PARENT_CHILD') => {
        const response = await client.post(`/families/${familyId}/members/${fromMemberId}/relationships`, {
            toMemberId,
            type
        });
        return response.data;
    },

    removeRelationship: async (familyId: string, member1Id: string, member2Id: string) => {
        await client.delete(`/families/${familyId}/relationships/by-members`, {
            params: { member1Id, member2Id }
        });
    },

    linkMember: async (familyId: string, memberId: string) => {
        await client.post(`/families/${familyId}/link-member/${memberId}`);
    },

    getMyMemberId: async (familyId: string) => {
        const response = await client.get<string>(`/families/${familyId}/my-member-id`);
        return response.data;
    }
};
