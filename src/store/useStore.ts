import { create } from 'zustand';
import { type Edge, type Node } from 'reactflow';
import type { FamilyMember } from '../types';

interface TreeState {
    nodes: Node[];
    edges: Edge[];
    selectedMemberId: string | null;
    familyData: FamilyMember[];
    collapsedNodes: string[]; // List of IDs that are collapsed (children hidden)
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setSelectedMember: (id: string | null) => void;
    setFamilyData: (data: FamilyMember[]) => void;
    toggleCollapse: (id: string) => void;
}

export const useStore = create<TreeState>((set) => ({
    nodes: [],
    edges: [],
    selectedMemberId: null,
    familyData: [],
    collapsedNodes: [],
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setSelectedMember: (id) => set({ selectedMemberId: id }),
    setFamilyData: (data) => set({ familyData: data }),
    toggleCollapse: (id) => set((state) => {
        const isCollapsed = state.collapsedNodes.includes(id);
        return {
            collapsedNodes: isCollapsed
                ? state.collapsedNodes.filter(nId => nId !== id)
                : [...state.collapsedNodes, id]
        };
    }),
}));
