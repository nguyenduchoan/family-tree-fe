import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { FamilyNodeData } from '@/types';
import { cn } from '@/lib/utils';
import { User, Plus, Minus, UserPlus } from 'lucide-react';
import { useStore } from '@/store/useStore';

const MemberCard = ({ member, isPrimary, sourceHandleId }: { member: any, isPrimary?: boolean, sourceHandleId?: string }) => {
    const { setSelectedMember } = useStore();

    if (!member) return null;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(member.id);
            }}
            className={cn(
                "flex flex-col items-center gap-2 p-3 min-w-[160px] cursor-pointer hover:bg-white/40 transition-colors relative z-10",
            )}>
            <div className="relative shrink-0">
                {member.avatar ? (
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-sm">
                        <User size={28} />
                    </div>
                )}
                {/* Gender Indicator */}
                <div className={cn(
                    "absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center",
                    member.gender === 'MALE' ? "bg-blue-500" : "bg-pink-500"
                )} />

                {member.deathDate && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center" title="Deceased">
                        <div className="w-1.5 h-1.5 bg-white rounded-full bg-opacity-50" />
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center w-full">
                <h3 className="font-bold text-gray-800 text-sm text-center line-clamp-2 leading-tight" title={member.name}>{member.name}</h3>

                {member.nickname && (
                    <span className="text-xs font-semibold text-emerald-600 tracking-wide mt-0.5">
                        ({member.nickname})
                    </span>
                )}

                <p className="text-[10px] text-gray-400 mt-1 font-medium bg-white/50 px-2 py-0.5 rounded-full">
                    {member.birthDate ? member.birthDate.split('-')[0] : '?'}
                    {member.deathDate ? ` - ${member.deathDate.split('-')[0]}` : ''}
                </p>
            </div>

            {/* Source Handle for this specific member */}
            {sourceHandleId && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id={sourceHandleId}
                    className="!bg-gray-400 !w-3 !h-3 !bottom-[-13px] opacity-0"
                />
            )}
        </div>
    )
}

const GlassFamilyNode = ({ id, data, selected }: NodeProps<FamilyNodeData>) => {
    const { collapsedNodes, toggleCollapse, familyData, currentUserMemberId, openAddMemberModal, currentFamily } = useStore();
    const isCollapsed = collapsedNodes.includes(id);
    const hasChildren = data.children && data.children.length > 0;
    const isCurrentUser = data.primary.id === currentUserMemberId;
    const hasMultipleSpouses = data.partners && data.partners.length > 1;

    // Helper to calculate total descendants recursively (Simplified for now)
    const totalChildren = data.children ? data.children.length : 0;
    const totalDescendants = 0; // TODO: Implement full recursive count if needed in Store or Utils

    return (
        <div
            className={cn(
                "glass-card rounded-xl transition-all duration-300 relative group flex flex-col items-stretch border-2 border-slate-300 shadow-md bg-white/80 backdrop-blur-xl",
                selected ? "border-primary ring-2 ring-primary/20 scale-105" : (isCurrentUser ? "border-emerald-500 ring-2 ring-emerald-500/20" : "")
            )}
        >
            {isCurrentUser && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-sm border border-emerald-500 uppercase tracking-wide">
                    Là Bạn
                </div>
            )}
            <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-3 !h-3" />

            {/* Content Row: Primary + [Partner] */}
            <div className="flex items-stretch divide-x divide-white/20">
                {/* Add Child Button (Visible on Hover) */}
                {currentFamily?.role !== 'VIEWER' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openAddMemberModal(data.primary.id, 'PARENT_CHILD');
                        }}
                        className="absolute -top-3 -right-3 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-emerald-600 hover:scale-110"
                        title="Thêm con"
                    >
                        <Plus size={14} />
                    </button>
                )}

                {/* Primary Member */}
                <MemberCard
                    member={data.primary}
                    isPrimary
                    sourceHandleId={hasMultipleSpouses ? `handle-${data.primary.id}` : undefined}
                />

                {/* Partners List */}
                {data.partners && data.partners.map((partner) => (
                    <MemberCard
                        key={partner.id}
                        member={partner}
                        sourceHandleId={hasMultipleSpouses ? `handle-${partner.id}` : undefined}
                    />
                ))}
            </div>

            {/* Stats Footer (Only if there are descendants) */}
            {totalChildren > 0 && (
                <div className="bg-white/30 border-t border-white/20 px-3 py-1.5 flex items-center justify-center gap-4 rounded-b-xl">
                    <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1" title="Số con trực tiếp">
                        <User size={12} className="text-blue-500" />
                        <span>{totalChildren} con</span>
                    </div>
                </div>
            )}

            {/* Global Handle for Single/Couple (Shared Center) */}
            {!hasMultipleSpouses && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="!bg-gray-400 !w-3 !h-3 opacity-0"
                />
            )}

            {/* Toggle Button for Children */}
            {hasChildren && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(id);
                    }}
                    className={cn(
                        "absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center cursor-pointer transition-colors z-20 shadow-sm",
                        isCollapsed ? "border-primary bg-primary text-white" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
                    )}
                >
                    {isCollapsed ? <Plus size={14} /> : <Minus size={14} />}
                </button>
            )}
        </div>
    );
};

export default memo(GlassFamilyNode);
