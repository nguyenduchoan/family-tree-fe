import dagre from 'dagre';
import { type Node, type Edge, Position } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeHeight = 300; // Updated for vertical layout

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({
        rankdir: direction,
        nodesep: 100, // Increased horizontal separation
        ranksep: 200, // Increased vertical separation significantly to prevent "wavy" look
        ranker: 'longest-path' // Use longest-path for better tree structure
    });

    nodes.forEach((node) => {
        const partnersCount = node.data?.partners?.length || 0;
        const width = 260 * (1 + partnersCount); // Slightly wider
        const height = nodeHeight;

        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // Group nodes by Y level to enforce strict alignment
    const yLevels: Record<number, number[]> = {};

    // First pass: Collect all Y positions
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const y = nodeWithPosition.y;

        // Find existing level within tolerance (e.g., 10px)
        const foundLevel = Object.keys(yLevels).find(key => Math.abs(parseFloat(key) - y) < 10);

        if (foundLevel) {
            yLevels[parseFloat(foundLevel)].push(y);
        } else {
            yLevels[y] = [y];
        }
    });

    // Calculate strictly aligned Y for each level (average)
    const alignedYs: Record<number, number> = {};
    Object.keys(yLevels).forEach(key => {
        const levelY = parseFloat(key);
        // Just use the levelY directly as the "snap" target, or average them.
        // Since Dagre usually outputs identical Ys, this is just a safeguard.
        // We map the original roughly-equal Ys to this single canonical Y.
        alignedYs[levelY] = levelY;
    });

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Find which level this node belongs to
        let snapY = nodeWithPosition.y;
        const foundLevel = Object.keys(alignedYs).find(key => Math.abs(parseFloat(key) - nodeWithPosition.y) < 10);
        if (foundLevel) {
            snapY = alignedYs[parseFloat(foundLevel)];
        }

        // We need to use the SAME width we told dagre, or recalculate it to center correctness.
        // Dagre gives center x,y. ReactFlow needs top-left x,y.
        const partnersCount = node.data?.partners?.length || 0;
        const width = 260 * (1 + partnersCount);

        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - width / 2,
            y: snapY - nodeHeight / 2,
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};
