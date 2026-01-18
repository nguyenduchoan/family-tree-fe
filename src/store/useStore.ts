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

    // User Linking
    currentUserMemberId: string | null;
    fetchCurrentUserMemberId: (familyId: string) => Promise<void>;
    linkCurrentUserMember: (familyId: string, memberId: string) => Promise<void>;
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
            get().logout(); // Or just clean up family state?
            // "Leave" implies you lose access.
            // Let's just deselect and refresh families.
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
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
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
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            set({ user: response.user, isLoading: false, isAuthChecked: true });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Registration failed', isLoading: false, isAuthChecked: true });
            throw err;
        }
    },

    logout: () => {
        authApi.logout();
        localStorage.removeItem('lastFamilyId');
        localStorage.removeItem('lastSelectedMemberId');
        set({ user: null, currentFamily: null, familyData: [], isAuthChecked: true });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        const lastFamilyId = localStorage.getItem('lastFamilyId');
        const lastSelectedMemberId = localStorage.getItem('lastSelectedMemberId');

        if (!token) {
            set({ isAuthChecked: true });
            return;
        }

        try {
            const user = await authApi.getMe();

            // Try to restore family session
            if (lastFamilyId) {
                try {
                    // We can fetch family details here. 
                    // Using get().selectFamily might trigger layout fetch again, which is good.
                    const family = await familyApi.getFamily(lastFamilyId);
                    // Manually set currentFamily first to avoid flash, then fetch members
                    set({ currentFamily: family });
                    await get().fetchMembers(family.id); // This already sets Loading=false at end

                    // Restore selected member if exists
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
            // Token invalid
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
            localStorage.removeItem('lastFamilyId');
            localStorage.removeItem('lastSelectedMemberId');
            set({ currentFamily: null, selectedMemberId: null, familyData: [], familyMembers: [] });
            return;
        }
        localStorage.setItem('lastFamilyId', family.id);
        // Clear old member selection when switching families
        localStorage.removeItem('lastSelectedMemberId');
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
        // Notes: Layout logic will be handled in the component for now
    },

    addMember: async (familyId, data, relationship) => {
        set({ isLoading: true });
        try {
            // 1. Create Member
            const newMember = await memberApi.createMember(familyId, data);

            // 2. Create Relationship if requested
            if (relationship) {
                try {
                    // Link to the main target (e.g., Father)
                    await memberApi.addRelationship(familyId, relationship.targetId, newMember.id, relationship.type);

                    // 2.1 AUTO-LINK: If adding child (PARENT_CHILD), also link to the spouse (Mother) if exists
                    if (relationship.type === 'PARENT_CHILD') {
                        const targetMember = get().familyData.find(m => m.id === relationship.targetId);
                        if (targetMember && targetMember.spouses && targetMember.spouses.length > 0) {
                            // Find the first spouse (Primary assumption: Monogamy for now/Nuclear family)
                            // Ideally, we might ask user, but "Smart Default" is good.
                            const spouseId = targetMember.spouses[0];
                            // Link spouse -> child
                            await memberApi.addRelationship(familyId, spouseId, newMember.id, 'PARENT_CHILD');
                        }
                    }
                } catch (relError) {
                    console.error("Failed to create relationship after adding member", relError);
                    // Continue to fetch members even if relationship fails, but maybe alert user?
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

            // AUTO-LINK: If adding PARENT_CHILD link (from Parent -> to Child)
            // Wait, arguments are (from, to, type).
            // Usually "Add Relationship" from UI is: "From X add relation Y with Z".
            // If type is PARENT_CHILD, it usually means "From Parent (Source) -> To Child (Target)".
            // Let's verify direction.

            if (type === 'PARENT_CHILD') {
                // fromMember is Parent. toMember is Child.
                const parent = get().familyData.find(m => m.id === fromMemberId);
                if (parent && parent.spouses && parent.spouses.length > 0) {
                    const spouseId = parent.spouses[0];
                    // Check if relationship already exists to avoid error or redundant calls?
                    // The backend API might handle existence check, but safe to try.
                    try {
                        await memberApi.addRelationship(familyId, spouseId, toMemberId, 'PARENT_CHILD');
                    } catch (e) {
                        // Ignore if already exists
                        console.log('Auto-link spouse failed or already exists', e);
                    }
                }
            } else if (type === 'SPOUSE') {
                // If linking two people as spouses, we might want to consolidate their children?
                // This is complex (Blended families). Let's stick to Parent-Child auto-linking for now.
            }

            // Optimization: Maybe verify backend returns correctly updated data
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

    // ... start existing methods ...
    setSelectedMember: (id) => {
        if (id) {
            localStorage.setItem('lastSelectedMemberId', id);
        } else {
            localStorage.removeItem('lastSelectedMemberId');
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

    // User Linking
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
    }
}));
