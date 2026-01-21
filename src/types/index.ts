export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
}

export interface Family {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
    memberCount: number;
    createdAt: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    birthDate?: string;
    deathDate?: string;
    gender: 'MALE' | 'FEMALE';
    avatar?: string;
    bio?: string;
    generation: number;
    spouses: string[];
    children: string[];
    parents: string[];
    phone?: string;
    email?: string;
    address?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
}

export interface CreateMemberRequest {
    name: string;
    gender: 'MALE' | 'FEMALE';
    birthDate?: string;
    deathDate?: string;
    avatar?: string;
    bio?: string;
    generation?: number;
    phone?: string;
    email?: string;
    address?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
}

export interface FamilyNodeData {
    primary: FamilyMember;
    partners: FamilyMember[];
    children: string[];
    label: string;
}

export interface FamilyMemberUser {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
    joinedAt: string;
}
