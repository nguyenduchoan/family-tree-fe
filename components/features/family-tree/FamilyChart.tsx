"use client";

import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    Node,
    Edge,
    useReactFlow,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from '@/store/useStore';
import { getLayoutedElements } from '@/lib/family-tree/layout';
import { buildFamilyGraph, getDescendants } from '@/lib/family-tree/treeUtils';
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

// Inner component containing the logic that uses useReactFlow
function FamilyChartContent({ onMemberClick }: FamilyChartProps) {
    const { nodes: storeNodes, edges: storeEdges, setNodes, setEdges, familyData, collapsedNodes } = useStore();
    const { fitView, setCenter } = useReactFlow();

    // State to track if React Flow instance is initialized and ready
    const [isTreeReady, setIsTreeReady] = useState(false);
    const initialFocus = useRef(false);

    // Local ReactFlow state
    const [nodes, setNodesState, onNodesChange] = useNodesState([]);
    const [edges, setEdgesState, onEdgesChange] = useEdgesState([]);

    // Transform logic ( Simplified Mock for Migration Steps )
    // Real implementation needs to traverse `familyData` from `store` and build the graph
    // Similar to `fe-new/src/utils/treeUtils.ts` (Need to port that too!)

    // Transform and Layout Logic
    useEffect(() => {
        if (!familyData || familyData.length === 0) return;

        // 1. Build Graph
        const { nodes: rawNodes, edges: rawEdges } = buildFamilyGraph(familyData);

        // 2. Filter Hidden Nodes (Collapse Logic)
        const hiddenNodeIds = new Set<string>();
        collapsedNodes.forEach((collapsedId) => {
            // Need to import getDescendants from treeUtils
            // Assuming we added it to the named exports
            const descendants = getDescendants(collapsedId, rawEdges);
            descendants.forEach(d => hiddenNodeIds.add(d));
        });

        const visibleNodes = rawNodes.filter(n => !hiddenNodeIds.has(n.id));
        const visibleEdges = rawEdges.filter(e =>
            !hiddenNodeIds.has(e.source) && !hiddenNodeIds.has(e.target)
        );

        // 3. Apply Auto Layout (Dagre) on VISIBLE elements only
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(visibleNodes, visibleEdges);

        setNodesState(layoutedNodes);
        setEdgesState(layoutedEdges);

        // Sync to Store (optional, for other components to access)
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        // Focus on Root Node (Top most node) - ONLY ON INITIAL LOAD
        // Wait for React Flow to be fully initialized (isTreeReady) before attempting focus
        if (layoutedNodes.length > 0 && !initialFocus.current && isTreeReady) {
            initialFocus.current = true; // Mark as processed immediately to avoid double firing

            // Use requestAnimationFrame to ensure nodes are painted in the browser
            window.requestAnimationFrame(() => {
                // Find Top Node (min Y)
                let rootNode = layoutedNodes[0];
                layoutedNodes.forEach(n => {
                    if (n.position.y < rootNode.position.y) {
                        rootNode = n;
                    }
                });

                const partnersCount = rootNode.data?.partners?.length || 0;
                // Width calculation matching layout.ts: 260 * (1 + partners)
                // Height matching nodeHeight: 300
                const width = 260 * (1 + partnersCount);
                const height = 300;

                const centerX = rootNode.position.x + width / 2;
                const centerY = rootNode.position.y + height / 2;

                // Center on the root node with reasonable zoom
                setCenter(centerX, centerY, { zoom: 0.8, duration: 1000 });
            });
        }

    }, [familyData, collapsedNodes, setNodes, setEdges, setNodesState, setEdgesState, isTreeReady, setCenter]);

    return (
        <div className="w-full h-full min-h-[600px] bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onInit={() => setIsTreeReady(true)}
                // fitView // Removed default fitView to allow custom focus control
                className="bg-background"
                minZoom={0.1}
            >
                <Background color="#aaa" gap={16} />
                <Controls className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-lg overflow-hidden !fill-gray-600 !stroke-gray-600" />
            </ReactFlow>
        </div>
    );
}

// Wrapper component to provide the ReactFlow context
export function FamilyChart(props: FamilyChartProps) {
    return (
        <ReactFlowProvider>
            <FamilyChartContent {...props} />
        </ReactFlowProvider>
    );
}
