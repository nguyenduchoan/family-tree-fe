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

export const processFamilyData = (members: FamilyMember[]) => {
    const nodes: Node<FamilyNodeData>[] = [];
    const edges: Edge[] = [];

    const memberMap = new Map<string, FamilyMember>();
    members.forEach(m => memberMap.set(m.id, m));

    // Track processed IDs so we don't create duplicates for partners
    const processedIds = new Set<string>();
    const memberToNodeId = new Map<string, string>();

    // 1. Create Nodes (grouping couples)
    members.forEach(member => {
        if (processedIds.has(member.id)) return;

        // Check if member has a spouse that is processed?
        // Actually, we should check if they are "main" or "secondary" in grouping.
        // Simple logic: If has spouse, check if spouse processed. If yes, skip (already merged).
        // If not, merge them.

        // Find partner (first spouse for simplicity in this logic)
        const partnerId = member.spouses[0];
        const partner = partnerId ? memberMap.get(partnerId) : undefined;

        if (partner && processedIds.has(partnerId)) {
            // Already processed as part of partner's node
            return;
        }

        const nodeId = partner ? `couple-${member.id}-${partner.id}` : member.id;

        // Mark both as processed
        processedIds.add(member.id);
        if (partner) processedIds.add(partner.id);

        // Map member IDs to this new Node ID
        memberToNodeId.set(member.id, nodeId);
        if (partner) memberToNodeId.set(partner.id, nodeId);

        // Collect merged children
        // We assume children lists are consistent, but let's merge unique IDs just in case.
        const childrenSet = new Set([...member.children]);
        if (partner) {
            partner.children.forEach(c => childrenSet.add(c));
        }

        nodes.push({
            id: nodeId,
            type: 'familyMember',
            data: {
                primary: member,
                partner: partner,
                children: Array.from(childrenSet),
                label: member.name + (partner ? ` & ${partner.name}` : ''),
            },
            position: { x: 0, y: 0 },
        });
    });

    // 2. Create Edges
    // Now iterate nodes and create edges based on children
    nodes.forEach(node => {
        const { children } = node.data;

        children.forEach(childId => {
            const childNodeId = memberToNodeId.get(childId);
            if (childNodeId) {
                // Determine if we already added this edge (two parents pointing to same child node)
                // With grouped parents (node) -> grouped child (node), there's only 1 edge.
                const edgeId = `e-${node.id}-${childNodeId}`;

                // Avoid duplicates if multiple children point to same node? 
                // No, children loop is specific. 
                // But wait, if multiple parents point to same child, we grouped parents.
                // So 'node' is the parent group. 'childNodeId' is the child group.

                if (!edges.some(e => e.id === edgeId)) {
                    edges.push({
                        id: edgeId,
                        source: node.id,
                        target: childNodeId,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: '#cbd5e1', strokeWidth: 2 },
                    });
                }
            }
        });
    });

    return { nodes, edges, memberToNodeId }; // Export map for finding nodes later
};
