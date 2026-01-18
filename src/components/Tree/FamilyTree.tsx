import { useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { mockFamilyData } from '../../data/mockData';
import FamilyNode from './FamilyNode';
import { processFamilyData, getDescendants } from '../../utils/treeUtils';
import { getLayoutedElements } from '../../utils/layout';
import { useStore } from '../../store/useStore';
import Header from '../UI/Header';
import MemberDetailPanel from '../UI/MemberDetailPanel';

const nodeTypes = {
    familyMember: FamilyNode,
};

const TreeFlow = () => {
    const { setNodes: setStoreNodes, setEdges: setStoreEdges, setFamilyData, collapsedNodes } = useStore();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    // Initialize Data & Handle Collapse
    useEffect(() => {
        // Always set mock data first
        if (useStore.getState().familyData.length === 0) {
            setFamilyData(mockFamilyData);
        }

        // 1. Process data (group couples)
        const { nodes: allNodes, edges: allEdges } = processFamilyData(mockFamilyData);

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

        // Fit view nicely after update
        window.requestAnimationFrame(() => {
            fitView({ padding: 0.2 });
        });

    }, [setFamilyData, setNodes, setEdges, setStoreNodes, setStoreEdges, fitView, collapsedNodes]);

    // const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    //     setSelectedMember(node.id);
    // }, [setSelectedMember]);

    return (
        <div className="w-full h-screen bg-[#f8f9fa] text-slate-900 flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    // onNodeClick handled internally by FamilyNode
                    fitView
                    minZoom={0.2}
                    maxZoom={2}
                    className="bg-tree-pattern bg-cover" // Example class if we add pattern
                >
                    <Background color="#e2e8f0" gap={16} size={1} />
                    <Controls showInteractive={false} className="!bg-white !border-slate-100 !shadow-sm !m-4" />
                </ReactFlow>

                <MemberDetailPanel />
            </div>
        </div>
    );
};

export default function FamilyTree() {
    return (
        <ReactFlowProvider>
            <TreeFlow />
        </ReactFlowProvider>
    );
}
