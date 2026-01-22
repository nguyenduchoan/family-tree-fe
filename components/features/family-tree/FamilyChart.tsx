"use client";

import { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    Node,
    Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from '@/store/useStore';
import { getLayoutedElements } from '@/lib/family-tree/layout';
import { buildFamilyGraph } from '@/lib/family-tree/treeUtils';
import GlassFamilyNode from './GlassFamilyNode';
import { cn } from '@/lib/utils';
import { FamilyMember } from '@/types';

// TODO: Create a service to transform flat Member[] to Nodes/Edges
// For now, let's keep it simple or assume data is transformed in useEffect

const nodeTypes = {
    familyMember: GlassFamilyNode,
};

interface FamilyChartProps {
    onMemberClick: (member: FamilyMember) => void;
}

export function FamilyChart({ onMemberClick }: FamilyChartProps) {
    const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges, familyData, collapsedNodes } = useStore();

    // Local ReactFlow state
    const [nodes, setNodesState, onNodesChange] = useNodesState([]);
    const [edges, setEdgesState, onEdgesChange] = useEdgesState([]);

    // Transform logic ( Simplified Mock for Migration Steps )
    // Real implementation needs to traverse `familyData` from `store` and build the graph
    // Similar to `fe-new/src/utils/treeUtils.ts` (Need to port that too!)

    // Transform and Layout Logic
    useEffect(() => {
        if (!familyData || familyData.length === 0) return;

        const { nodes: rawNodes, edges: rawEdges } = buildFamilyGraph(familyData);

        // Apply Auto Layout (Dagre)
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);

        setNodesState(layoutedNodes);
        setEdgesState(layoutedEdges);

        // Sync to Store (optional, for other components to access)
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

    }, [familyData, setNodes, setEdges, setNodesState, setEdgesState]);

    return (
        <div className="w-full h-full min-h-[600px] bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
                minZoom={0.1}
            >
                <Background color="#aaa" gap={16} />
                <Controls className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-lg overflow-hidden !fill-gray-600 !stroke-gray-600" />
            </ReactFlow>
        </div>
    );
}
