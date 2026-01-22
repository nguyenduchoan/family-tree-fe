import { Node, Edge } from 'reactflow';
import { FamilyMember, FamilyNodeData } from '@/types';

// Helper to find the "Primary" partner (usually the first one, or the one in the same family tree context)
const findPrimaryPartner = (member: FamilyMember, allMembers: FamilyMember[]) => {
    if (!member.spouses || member.spouses.length === 0) return null;
    return allMembers.find(m => m.id === member.spouses[0]);
};

const PARTNER_COLORS = [
    '#db2777', // Pink-600
    '#7c3aed', // Violet-600
    '#2563eb', // Blue-600
    '#059669', // Emerald-600
    '#d97706', // Amber-600
    '#dc2626', // Red-600
];

export const buildFamilyGraph = (members: FamilyMember[], rootId?: string) => {
    const nodes: Node<FamilyNodeData>[] = [];
    const edges: Edge[] = [];

    if (!members || members.length === 0) return { nodes, edges };

    const memberMap = new Map<string, FamilyMember>();
    members.forEach(m => memberMap.set(m.id, m));

    // Track processed IDs so we don't create duplicates for partners
    const processedIds = new Set<string>();
    const memberToNodeId = new Map<string, string>();

    // 1. Create Nodes (grouping couples/partners)
    members.forEach(member => {
        if (processedIds.has(member.id)) return;

        // Collect all valid partners who haven't been processed yet
        const partners = (member.spouses || [])
            .map(id => memberMap.get(id))
            .filter((p): p is FamilyMember => !!p && !processedIds.has(p.id));

        // Create a composite ID for the node if there are partners, to ensure uniqueness and stability
        // Or simply use the primary member's ID if that's sufficient for your app's logic
        // fe-new used composite: `group-${member.id}-${partners...}`
        // Let's stick to member.id for simplicity if it works, BUT fe-new logic suggests composite might be better for "Couple" identity.
        // However, standardizing on Primary Member ID as Node ID is often easier for updates (CRUD).
        // Let's try to keep Primary ID as Node ID for now to minimize refactors elsewhere (e.g. onMemberClick).
        // Update: fe-new uses composite. If we change it, we must ensure edges find it.
        const nodeId = member.id;

        // Mark all as processed
        processedIds.add(member.id);
        partners.forEach(p => processedIds.add(p.id));

        // Map member IDs to this new Node ID
        memberToNodeId.set(member.id, nodeId);
        partners.forEach(p => memberToNodeId.set(p.id, nodeId));

        // Collect merged children from all involved members
        const childrenSet = new Set([...(member.children || [])]);
        partners.forEach(p => (p.children || []).forEach(c => childrenSet.add(c)));

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
    nodes.forEach(node => {
        const { children } = node.data;

        children.forEach((childId: string) => {
            const childNodeId = memberToNodeId.get(childId);
            if (childNodeId) {
                const edgeId = `e-${node.id}-${childNodeId}`;

                // Determine Source Handle based on biological parents
                let sourceHandle: string | undefined = undefined;
                let strokeColor = '#334155'; // Default Slate-700
                let strokeWidth = 1.5;

                // Only perform complex handle matching if there are multiple partners (complex family unit)
                if (node.data.partners.length > 0) {
                    // Default to Primary's handle (shared center usually, unless we have specific handle logic)
                    // If GlassFamilyNode expects handles for everyone when > 0 partners:
                    // Check GlassFamilyNode logic: 
                    //   sourceHandleId={hasMultipleSpouses ? `handle-${data.primary.id}` : undefined}
                    // So if partners > 1 (hasMultipleSpouses), we MUST provide a handle ID.

                    const hasMultipleSpouses = node.data.partners.length > 1;

                    if (hasMultipleSpouses) {
                        sourceHandle = `handle-${node.data.primary.id}`; // Default to primary

                        const child = memberMap.get(childId);
                        if (child && child.parents) {
                            // Check if child belongs to one of the partners
                            const partnerIndex = node.data.partners.findIndex(p => child.parents?.includes(p.id));
                            if (partnerIndex !== -1) {
                                const partnerParent = node.data.partners[partnerIndex];
                                sourceHandle = `handle-${partnerParent.id}`;
                                strokeColor = PARTNER_COLORS[partnerIndex % PARTNER_COLORS.length];
                                strokeWidth = 2;
                            }
                        }
                    }
                }

                if (!edges.some(e => e.id === edgeId)) {
                    edges.push({
                        id: edgeId,
                        source: node.id,
                        target: childNodeId,
                        sourceHandle: sourceHandle,
                        type: 'smoothstep', // Reverted to smoothstep for orthogonal "square" lines
                        animated: true,
                        style: { stroke: strokeColor, strokeWidth: strokeWidth },
                        // className: '!stroke-gray-400 !stroke-2', // Removed valid css class to use style instead for dynamic colors
                    });
                }
            }
        });
    });

    return { nodes, edges };
};
