import { create } from 'zustand';
import { type Edge, type Node } from 'reactflow';
import type { FamilyMember, User, Family, FamilyMemberUser } from '../types';
import { authApi } from '../api/auth';
import { familyApi } from '../api/family';
import { memberApi } from '../api/member';

interface TreeState {
    // Auth & App State
    user: User | null;
    currentFamily: Family | null;
    isLoading: boolean;
    isAuthChecked: boolean;
    error: string | null;

    // UI State
    addRelationshipModal: {
        isOpen: boolean;
        sourceMemberId: string | null;
        initialType: 'SPOUSE' | 'PARENT_CHILD';
    };

    addMemberModal: {
        isOpen: boolean;
        relatedMemberId: string | null;
        relationType: 'SPOUSE' | 'PARENT_CHILD' | null;
    };

    editMemberModal: {
        isOpen: boolean;
        memberId: string | null;
    };

    // Tree Data
    nodes: Node[];
    edges: Edge[];
    selectedMemberId: string | null;
    familyData: FamilyMember[];
    collapsedNodes: string[];

    // Actions
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;

    fetchFamilies: () => Promise<Family[]>;
    createFamily: (data: { name: string; description?: string }) => Promise<void>;
    selectFamily: (family: Family | null) => Promise<void>;

    fetchMembers: (familyId: string) => Promise<void>;
    addMember: (familyId: string, data: any, relationship?: { targetId: string, type: 'SPOUSE' | 'PARENT_CHILD' }) => Promise<void>;
    updateMember: (familyId: string, memberId: string, data: any) => Promise<void>;
    deleteMember: (familyId: string, memberId: string) => Promise<void>;
    removeRelationship: (familyId: string, member1Id: string, member2Id: string) => Promise<void>;
    addRelationship: (familyId: string, fromMemberId: string, toMemberId: string, type: 'SPOUSE' | 'PARENT_CHILD') => Promise<void>;

    // Family Member Management (Users)
    familyMembers: FamilyMemberUser[];
    fetchFamilyMembers: (familyId: string) => Promise<void>;
    leaveFamily: (familyId: string) => Promise<void>;
    removeFamilyMember: (familyId: string, userId: string) => Promise<void>;
    updateFamilyMemberRole: (familyId: string, userId: string, role: 'OWNER' | 'EDITOR' | 'VIEWER') => Promise<void>;

    // UI Actions
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setSelectedMember: (id: string | null) => void;
    toggleCollapse: (id: string) => void;
    openAddRelationshipModal: (memberId: string, type?: 'SPOUSE' | 'PARENT_CHILD') => void;
    closeAddRelationshipModal: () => void;

    openAddMemberModal: (relatedMemberId?: string, relationType?: 'SPOUSE' | 'PARENT_CHILD') => void;
    closeAddMemberModal: () => void;

    openEditMemberModal: (memberId: string) => void;
    closeEditMemberModal: () => void;

    // User Linking
    currentUserMemberId: string | null;
    fetchCurrentUserMemberId: (familyId: string) => Promise<void>;
    linkCurrentUserMember: (familyId: string, memberId: string) => Promise<void>;

    // Public Share
    loadPublicFamily: (family: Family, members: FamilyMember[]) => void;
}

export const useStore = create<TreeState>((set, get) => ({
    user: null,
    currentFamily: null,
    isLoading: false,
    isAuthChecked: false,
    error: null,

    addRelationshipModal: {
        isOpen: false,
        sourceMemberId: null,
        initialType: 'SPOUSE'
    },

    addMemberModal: {
        isOpen: false,
        relatedMemberId: null,
        relationType: null
    },

    nodes: [],
    edges: [],
    selectedMemberId: null,
    familyData: [],
    familyMembers: [],
    collapsedNodes: [],

    fetchFamilyMembers: async (familyId) => {
        try {
            const members = await familyApi.getFamilyMembers(familyId);
            set({ familyMembers: members });
        } catch (error) {
            console.error("Failed to fetch family members", error);
        }
    },

    leaveFamily: async (familyId) => {
        set({ isLoading: true });
        try {
            await familyApi.leaveFamily(familyId);
            get().logout();
            set({ currentFamily: null, familyData: [], familyMembers: [] });
            await get().fetchFamilies();
        } finally {
            set({ isLoading: false });
        }
    },

    removeFamilyMember: async (familyId, userId) => {
        set({ isLoading: true });
        try {
            await familyApi.removeMember(familyId, userId);
            await get().fetchFamilyMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    updateFamilyMemberRole: async (familyId, userId, role) => {
        set({ isLoading: true });
        try {
            await familyApi.updateMemberRole(familyId, userId, role);
            await get().fetchFamilyMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.login(data);
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            set({ user: response.user, isLoading: false, isAuthChecked: true });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Login failed', isLoading: false, isAuthChecked: true });
            throw err;
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.register(data);
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            set({ user: response.user, isLoading: false, isAuthChecked: true });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Registration failed', isLoading: false, isAuthChecked: true });
            throw err;
        }
    },

    logout: () => {
        authApi.logout();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('lastFamilyId');
            localStorage.removeItem('lastSelectedMemberId');
        }
        set({ user: null, currentFamily: null, familyData: [], isAuthChecked: true });
    },

    checkAuth: async () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('accessToken');
        const lastFamilyId = localStorage.getItem('lastFamilyId');
        const lastSelectedMemberId = localStorage.getItem('lastSelectedMemberId');

        if (!token) {
            set({ isAuthChecked: true });
            return;
        }

        try {
            const user = await authApi.getMe();

            if (lastFamilyId) {
                try {
                    const family = await familyApi.getFamily(lastFamilyId);
                    set({ currentFamily: family });
                    await get().fetchMembers(family.id);

                    if (lastSelectedMemberId) {
                        set({ selectedMemberId: lastSelectedMemberId });
                    }
                } catch (famErr) {
                    console.warn('Failed to restore last family', famErr);
                    localStorage.removeItem('lastFamilyId');
                    localStorage.removeItem('lastSelectedMemberId');
                }
            }

            set({ user, isAuthChecked: true });
        } catch (err) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('lastFamilyId');
            localStorage.removeItem('lastSelectedMemberId');
            set({ user: null, isAuthChecked: true });
        }
    },

    fetchFamilies: async () => {
        return await familyApi.getMyFamilies();
    },

    createFamily: async (data) => {
        set({ isLoading: true });
        try {
            const family = await familyApi.createFamily(data);
            await get().selectFamily(family);
        } finally {
            set({ isLoading: false });
        }
    },

    selectFamily: async (family) => {
        if (!family) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('lastFamilyId');
                localStorage.removeItem('lastSelectedMemberId');
            }
            set({ currentFamily: null, selectedMemberId: null, familyData: [], familyMembers: [] });
            return;
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastFamilyId', family.id);
            localStorage.removeItem('lastSelectedMemberId');
        }
        set({ currentFamily: family, isLoading: true, selectedMemberId: null });
        try {
            await get().fetchMembers(family.id);
            get().fetchCurrentUserMemberId(family.id);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMembers: async (familyId) => {
        const members = await memberApi.getAllMembers(familyId);
        set({ familyData: members });
    },

    addMember: async (familyId, data, relationship) => {
        set({ isLoading: true });
        try {
            const newMember = await memberApi.createMember(familyId, data);

            if (relationship) {
                try {
                    await memberApi.addRelationship(familyId, relationship.targetId, newMember.id, relationship.type);

                    if (relationship.type === 'PARENT_CHILD') {
                        const targetMember = get().familyData.find(m => m.id === relationship.targetId);
                        if (targetMember && targetMember.spouses && targetMember.spouses.length > 0) {
                            const spouseId = targetMember.spouses[0];
                            await memberApi.addRelationship(familyId, spouseId, newMember.id, 'PARENT_CHILD');
                        }
                    }
                } catch (relError) {
                    console.error("Failed to create relationship after adding member", relError);
                }
            }

            await get().fetchMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    updateMember: async (familyId, memberId, data) => {
        set({ isLoading: true });
        try {
            await memberApi.updateMember(familyId, memberId, data);
            await get().fetchMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    addRelationship: async (familyId, fromMemberId, toMemberId, type) => {
        set({ isLoading: true });
        try {
            await memberApi.addRelationship(familyId, fromMemberId, toMemberId, type);

            if (type === 'PARENT_CHILD') {
                const parent = get().familyData.find(m => m.id === fromMemberId);
                if (parent && parent.spouses && parent.spouses.length > 0) {
                    const spouseId = parent.spouses[0];
                    try {
                        // Add delay to prevent race conditions/backend locking
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await memberApi.addRelationship(familyId, spouseId, toMemberId, 'PARENT_CHILD');
                    } catch (e) {
                        console.warn('Auto-link spouse failed (likely already exists or auth redirect ignored)', e);
                    }
                }
            }

            await get().fetchMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteMember: async (familyId, memberId) => {
        set({ isLoading: true });
        try {
            await memberApi.deleteMember(familyId, memberId);
            await get().fetchMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    removeRelationship: async (familyId, member1Id, member2Id) => {
        set({ isLoading: true });
        try {
            await memberApi.removeRelationship(familyId, member1Id, member2Id);
            await get().fetchMembers(familyId);
        } finally {
            set({ isLoading: false });
        }
    },

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    setSelectedMember: (id) => {
        if (typeof window !== 'undefined') {
            if (id) {
                localStorage.setItem('lastSelectedMemberId', id);
            } else {
                localStorage.removeItem('lastSelectedMemberId');
            }
        }
        set({ selectedMemberId: id });
    },
    toggleCollapse: (id) => set((state) => {
        const isCollapsed = state.collapsedNodes.includes(id);
        return {
            collapsedNodes: isCollapsed
                ? state.collapsedNodes.filter(nId => nId !== id)
                : [...state.collapsedNodes, id]
        };
    }),
    openAddRelationshipModal: (memberId, type = 'SPOUSE') => set({
        addRelationshipModal: {
            isOpen: true,
            sourceMemberId: memberId,
            initialType: type
        }
    }),
    closeAddRelationshipModal: () => set({
        addRelationshipModal: {
            isOpen: false,
            sourceMemberId: null,
            initialType: 'SPOUSE'
        }
    }),

    openAddMemberModal: (relatedMemberId, relationType) => set({
        addMemberModal: {
            isOpen: true,
            relatedMemberId: relatedMemberId || null,
            relationType: relationType || null
        }
    }),
    closeAddMemberModal: () => set({
        addMemberModal: {
            isOpen: false,
            relatedMemberId: null,
            relationType: null
        }
    }),


    openEditMemberModal: (memberId) => {
        set({
            editMemberModal: {
                isOpen: true,
                memberId
            }
        });
    },
    closeEditMemberModal: () => set({
        editMemberModal: {
            isOpen: false,
            memberId: null
        }
    }),
    editMemberModal: {
        isOpen: false,
        memberId: null
    },


    currentUserMemberId: null,
    fetchCurrentUserMemberId: async (familyId: string) => {
        try {
            const id = await memberApi.getMyMemberId(familyId);
            set({ currentUserMemberId: id || null });
        } catch (error) {
            console.error('Failed to fetch current user member ID:', error);
            set({ currentUserMemberId: null });
        }
    },
    linkCurrentUserMember: async (familyId: string, memberId: string) => {
        try {
            await memberApi.linkMember(familyId, memberId);
            set({ currentUserMemberId: memberId });
        } catch (error) {
            console.error('Failed to link member:', error);
            throw error;
        }
    },

    loadPublicFamily: (family: Family, members: FamilyMember[]) => {
        set({
            currentFamily: family,
            familyData: members,
            isLoading: false,
            // Ensure no user session is assumed/cleared if needed, though 'user' state might remain null
            // We might want a flag 'isReadOnly' if we want to enforce UI restrictions based on store
        });
    }
}));
