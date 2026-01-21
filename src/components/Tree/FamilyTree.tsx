import { useEffect, useRef, useState } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import FamilyNode from './FamilyNode';
import { processFamilyData, getDescendants } from '../../utils/treeUtils';
import { getLayoutedElements } from '../../utils/layout';
import { useStore } from '../../store/useStore';

import MemberDetailPanel from '../UI/MemberDetailPanel';
import AddRelationshipModal from '../Member/AddRelationshipModal';
import AddMemberModal from '../Member/AddMemberModal';

// Define nodeTypes OUTSIDE the component to prevent re-creation on every render
const nodeTypes = {
    familyMember: FamilyNode,
};

const TreeFlow = () => {
    const { setNodes: setStoreNodes, setEdges: setStoreEdges, familyData, collapsedNodes, currentFamily, fetchMembers } = useStore();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView, setCenter } = useReactFlow();

    // State to track if React Flow instance is initialized and ready
    const [isTreeReady, setIsTreeReady] = useState(false);
    const initialFocus = useRef(false);

    // Initialize Data & Handle Collapse
    useEffect(() => {
        if (familyData.length === 0 && currentFamily) {
            fetchMembers(currentFamily.id).catch(console.error);
        }
    }, [currentFamily, familyData.length, fetchMembers]);

    // Reset initial focus state when switching families
    useEffect(() => {
        initialFocus.current = false;
    }, [currentFamily]);

    // Update Layout whenever familyData or collapsedNodes change
    useEffect(() => {
        if (familyData.length === 0) return;

        // 1. Process data (group couples)
        const { nodes: allNodes, edges: allEdges } = processFamilyData(familyData);

        // 2. Identify hidden nodes based on collapsed state
        const hiddenNodeIds = new Set<string>();
        collapsedNodes.forEach((collapsedId) => {
            const descendants = getDescendants(collapsedId, allEdges);
            descendants.forEach(d => hiddenNodeIds.add(d));
        });

        // 3. Filter nodes and edges
        const visibleNodes = allNodes.filter(n => !hiddenNodeIds.has(n.id));
        const visibleEdges = allEdges.filter(e =>
            !hiddenNodeIds.has(e.source) && !hiddenNodeIds.has(e.target)
        );

        // 4. Run Layout on visible elements
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            visibleNodes,
            visibleEdges
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setStoreNodes(layoutedNodes);
        setStoreEdges(layoutedEdges);

        // Fit view nicely after update (only if nodes exist)
        // Focus on Root Node (Top most node) - ONLY ON INITIAL LOAD
        // Wait for React Flow to be fully initialized (isTreeReady) before attempting focus
        // This ensures the DOM nodes are mounted and can be manipulated by setCenter
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
                // Width calculation matching layout.ts: 250 * (1 + partners)
                const width = 250 * (1 + partnersCount);
                const height = 180; // Approximate height of node

                const centerX = rootNode.position.x + width / 2;
                const centerY = rootNode.position.y + height / 2;

                // Center on the root node with reasonable zoom
                setCenter(centerX, centerY, { zoom: 0.8, duration: 1000 });
            });
        }

    }, [familyData, collapsedNodes, setNodes, setEdges, setStoreNodes, setStoreEdges, fitView, setCenter, isTreeReady]);

    return (
        <div className="w-full h-screen bg-[#f8f9fa] text-slate-900 flex flex-col overflow-hidden">
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    onInit={() => setIsTreeReady(true)}
                    // onNodeClick handled internally by FamilyNode
                    minZoom={0.2}
                    maxZoom={2}
                    className="bg-tree-pattern bg-cover" // Example class if we add pattern
                >
                    <Background color="#e2e8f0" gap={16} size={1} />
                    <Controls showInteractive={false} className="!bg-white !border-slate-100 !shadow-sm !m-4" />
                </ReactFlow>

                <MemberDetailPanel />
                <AddRelationshipModal />
                <AddMemberModal />
            </div>
        </div>
    );
};

export default function FamilyTree() {
    return <TreeFlow />;
}
