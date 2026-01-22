import dagre from 'dagre';
import { type Node, type Edge, Position } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeHeight = 300; // Updated for vertical layout

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({
        rankdir: direction,
        nodesep: 50,
        ranksep: 400, // Maximized vertical spacing (400) to allow clean smoothstep turns
        ranker: 'network-simplex' // Network simplex usually minimizes edge length better
    });

    // 1. Setup Dagre Graph
    nodes.forEach((node) => {
        const partnersCount = node.data?.partners?.length || 0;
        const width = 260 * (1 + partnersCount);
        const height = nodeHeight;

        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // 2. Run Dagre
    dagre.layout(dagreGraph);

    // 3. Snap Y positions to grid (Strict Alignment)
    const yLevels: Record<number, number[]> = {};

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const y = nodeWithPosition.y;

        // Group Ys within tolerance
        const foundLevel = Object.keys(yLevels).find(key => Math.abs(parseFloat(key) - y) < 50);

        if (foundLevel) {
            yLevels[parseFloat(foundLevel)].push(y);
        } else {
            yLevels[y] = [y];
        }
    });

    const alignedYs: Record<number, number> = {};
    const sortedLevels = Object.keys(yLevels).map(Number).sort((a, b) => a - b);

    // Force specific generation distance
    const LEVEL_HEIGHT = 600; // Explicit large step

    sortedLevels.forEach((levelY, index) => {
        // Option A: Use index * LEVEL_HEIGHT (Strict BFS-style forcing)
        // Option B: Use layout Y but snapped.
        // User wants "Child same height". Layout Y usually gives this. 
        // Let's stick to SNAP, but spacing logic:
        // alignedYs[levelY] = index * LEVEL_HEIGHT + (nodeHeight / 2); // FORCE strict generations

        // Actually, forcing strict generations by Index is safer if Dagre is correct about rank.
        // But Dagre might skip ranks? 
        // Be safe: Use the Snapped Y, but ensure minimum delta?
        // Let's use the Snapped Y as Canonical, but apply a multiplier if needed? 
        // No, let's just trust Dagre's Rank Separation (ranksep=400) which should naturally space them.
        alignedYs[levelY] = levelY;
    });

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        let snapY = nodeWithPosition.y;
        const foundLevel = Object.keys(alignedYs).find(key => Math.abs(parseFloat(key) - nodeWithPosition.y) < 50);
        if (foundLevel) {
            snapY = alignedYs[parseFloat(foundLevel)];
        }

        const partnersCount = node.data?.partners?.length || 0;
        // Use consistent width as per GlassFamilyNode assumption
        const width = 260 * (1 + partnersCount);

        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - width / 2,
            y: snapY - nodeHeight / 2,
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};
