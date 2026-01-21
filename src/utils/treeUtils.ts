import type { Edge, Node } from 'reactflow';
import type { FamilyMember, FamilyNodeData } from '../types';

export const getDescendants = (nodeId: string, edges: Edge[]): string[] => {
    const descendants = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        // Tìm các edge bắt đầu từ node hiện tại (source = currentId)
        const childEdges = edges.filter(edge => edge.source === currentId);

        childEdges.forEach(edge => {
            if (!descendants.has(edge.target)) {
                descendants.add(edge.target);
                queue.push(edge.target);
            }
        });
    }

    return Array.from(descendants);
};

// Palette for distinguishing multiple partners' lineages
const PARTNER_COLORS = [
    '#db2777', // Pink-600
    '#7c3aed', // Violet-600
    '#2563eb', // Blue-600
    '#059669', // Emerald-600
    '#d97706', // Amber-600
    '#dc2626', // Red-600
];

export const processFamilyData = (members: FamilyMember[]) => {
    const nodes: Node<FamilyNodeData>[] = [];
    const edges: Edge[] = [];

    const memberMap = new Map<string, FamilyMember>();
    members.forEach(m => memberMap.set(m.id, m));

    // Track processed IDs so we don't create duplicates for partners
    const processedIds = new Set<string>();
    const memberToNodeId = new Map<string, string>();

    // 1. Create Nodes (grouping couples/partners)
    members.forEach(member => {
        if (processedIds.has(member.id)) return;

        // Collect all valid partners who haven't been processed yet
        // This handles "One Husband, Multiple Wives" by grouping them into the Husband's node
        const partners = member.spouses
            .map(id => memberMap.get(id))
            .filter((p): p is FamilyMember => !!p && !processedIds.has(p.id));

        const nodeId = partners.length > 0
            ? `group-${member.id}-${partners.map(p => p.id).join('-')}`
            : member.id;

        // Mark all as processed
        processedIds.add(member.id);
        partners.forEach(p => processedIds.add(p.id));

        // Map member IDs to this new Node ID
        memberToNodeId.set(member.id, nodeId);
        partners.forEach(p => memberToNodeId.set(p.id, nodeId));

        // Collect merged children from all involved members
        const childrenSet = new Set([...member.children]);
        partners.forEach(p => p.children.forEach(c => childrenSet.add(c)));

        // Create Label
        const label = [member.name, ...partners.map(p => p.name)].join(' & ');

        nodes.push({
            id: nodeId,
            type: 'familyMember',
            data: {
                primary: member,
                partners: partners,
                children: Array.from(childrenSet),
                label: label,
            },
            position: { x: 0, y: 0 },
        });
    });

    // 2. Create Edges
    // Now iterate nodes and create edges based on children
    nodes.forEach(node => {
        const { children } = node.data;

        children.forEach((childId: string) => {
            const childNodeId = memberToNodeId.get(childId);
            if (childNodeId) {
                // Determine if we already added this edge (two parents pointing to same child node)
                // With grouped parents (node) -> grouped child (node), there's only 1 edge.
                const edgeId = `e-${node.id}-${childNodeId}`;

                // Avoid duplicates if multiple children point to same node? 
                // No, children loop is specific. 
                // But wait, if multiple parents point to same child, we grouped parents.
                // So 'node' is the parent group. 'childNodeId' is the child group.

                // Determine Source Handle based on biological parents
                // ONLY use specific handles if multiple partners exist (Husband + 2 or more Wives)
                // If standard couple (Husband + 1 Wife), keep sourceHandle undefined to use shared center (default)
                let sourceHandle = undefined;
                let strokeColor = '#334155'; // Default Slate-700
                const DEFAULT_STROKE_WIDTH = 1.5;
                let strokeWidth = DEFAULT_STROKE_WIDTH;

                if (node.data.partners.length > 1) {
                    sourceHandle = `handle-${node.data.primary.id}`; // Default to primary specific handle

                    const child = memberMap.get(childId);
                    if (child && child.parents) {
                        // Check if child has a parent in the partners list
                        const partnerIndex = node.data.partners.findIndex(p => child.parents.includes(p.id));
                        if (partnerIndex !== -1) {
                            const partnerParent = node.data.partners[partnerIndex];
                            sourceHandle = `handle-${partnerParent.id}`;

                            // Assign distinct color based on partner order
                            strokeColor = PARTNER_COLORS[partnerIndex % PARTNER_COLORS.length];
                            strokeWidth = 2; // Make these lines slightly thicker
                        }
                    }
                }

                if (!edges.some(e => e.id === edgeId)) {
                    edges.push({
                        id: edgeId,
                        source: node.id,
                        target: childNodeId,
                        sourceHandle: sourceHandle,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: strokeColor, strokeWidth: strokeWidth },
                    });
                }
            }
        });
    });

    return { nodes, edges, memberToNodeId }; // Export map for finding nodes later
};
