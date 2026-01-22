import { Node, Edge } from 'reactflow';
import { FamilyMember, FamilyNodeData } from '@/types';

// Helper to find the "Primary" partner (usually the first one, or the one in the same family tree context)
const findPrimaryPartner = (member: FamilyMember, allMembers: FamilyMember[]) => {
    if (!member.spouses || member.spouses.length === 0) return null;
    return allMembers.find(m => m.id === member.spouses[0]);
};

export const buildFamilyGraph = (members: FamilyMember[], rootId?: string) => {
    const nodes: Node<FamilyNodeData>[] = [];
    const edges: Edge[] = [];

    if (!members || members.length === 0) return { nodes, edges };

    // Set of processed members to avoid duplicates
    const processedMap = new Set<string>();

    members.forEach(member => {
        if (processedMap.has(member.id)) return;

        // Skip if this member is a "secondary" partner (already handled by their spouse)
        // logic: if they are spouse of someone who has smaller ID? or logic based on "Bloodline"?
        // For simplicity: We create a node for every "Couple" or "Single".

        // Check if we already processed this person as a partner of someone else?
        // Actually, let's iterate and build "FamilyUnit" nodes.

        const partners = (member.spouses || []).map(sId => members.find(m => m.id === sId)).filter(Boolean) as FamilyMember[];

        // Rule: Identify the "Main" node for the couple.
        // We handle the node when we encounter the "Primary" person.
        // If A and B are married. We only create one Node { primary: A, partners: [B] }.
        // How to determine who is A? reliable way: ID string comparison or "Bloodline" flag if existed.
        // Fallback: Process if !processedMap.has(partner.id)

        let shouldProcess = true;
        for (const p of partners) {
            if (processedMap.has(p.id)) {
                shouldProcess = false; // Already processed as part of that partner's node
                break;
            }
        }

        if (!shouldProcess) return;

        // Mark self and partners as processed
        processedMap.add(member.id);
        partners.forEach(p => processedMap.add(p.id));

        const nodeId = member.id;

        nodes.push({
            id: nodeId,
            type: 'familyMember',
            data: {
                primary: member,
                partners: partners,
                children: member.children,
                label: member.name
            },
            position: { x: 0, y: 0 }, // Will be set by Layout
        });

        // Create Edges to Children
        // We only create edges from the "Couple Node" to the "Child Node".
        // The child node's ID will be the child's primary ID.

        if (member.children) {
            member.children.forEach(childId => {
                edges.push({
                    id: `e-${nodeId}-${childId}`,
                    source: nodeId,
                    target: childId,
                    type: 'smoothstep',
                    className: '!stroke-gray-400 !stroke-2',
                });
            });
        }
    });

    return { nodes, edges };
};
