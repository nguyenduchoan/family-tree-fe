import dagre from 'dagre';
import { type Node, type Edge, Position } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeHeight = 100;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 100 });

    nodes.forEach((node) => {
        const partnersCount = node.data?.partners?.length || 0;
        const width = 250 * (1 + partnersCount);
        const height = nodeHeight;

        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // We need to use the SAME width we told dagre, or recalculate it to center correctness.
        // Dagre gives center x,y. ReactFlow needs top-left x,y.
        const partnersCount = node.data?.partners?.length || 0;
        const width = 250 * (1 + partnersCount);

        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - width / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};
