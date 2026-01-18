import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { FamilyNodeData } from '../../types';
import clsx from 'clsx';
import { User, Plus, Minus, UserPlus } from 'lucide-react';
import { useStore } from '../../store/useStore';

const MemberCard = ({ member }: { member: any, isPrimary?: boolean }) => {
    const { setSelectedMember } = useStore();

    if (!member) return null;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(member.id);
            }}
            className={clsx(
                "flex items-center gap-3 p-3 min-w-[200px] cursor-pointer hover:bg-slate-50 transition-colors",
            )}>
            <div className="relative shrink-0">
                {member.avatar ? (
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={20} />
                    </div>
                )}
                {member.deathDate && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-800 rounded-full border-2 border-white" title="Deceased" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate" title={member.name}>{member.name}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {member.birthDate} {member.deathDate ? `- ${member.deathDate}` : ''}
                </p>
            </div>

            {/* Gender Dot */}
            <div className={clsx(
                "w-1.5 h-1.5 rounded-full shrink-0",
                member.gender === 'MALE' ? "bg-blue-400" : "bg-pink-400"
            )} />
        </div>
    )
}

const FamilyNode = ({ id, data, selected }: NodeProps<FamilyNodeData>) => {
    const { collapsedNodes, toggleCollapse, familyData, currentUserMemberId } = useStore();
    const isCollapsed = collapsedNodes.includes(id);
    const hasChildren = data.children && data.children.length > 0;
    const isCurrentUser = data.primary.id === currentUserMemberId;

    // Helper to calculate total descendants recursively
    const countDescendants = (memberIds: string[]): number => {
        if (!memberIds || memberIds.length === 0) return 0;
        let count = 0;
        memberIds.forEach(id => {
            count++; // Count the child itself
            const member = familyData.find(m => m.id === id);
            if (member && member.children && member.children.length > 0) {
                count += countDescendants(member.children);
            }
        });
        return count;
    };

    const totalChildren = data.children ? data.children.length : 0;
    const totalDescendants = data.children ? countDescendants(data.children) : 0;

    return (
        <div
            className={clsx(
                "bg-white rounded-xl shadow-lg border-2 transition-all duration-300 relative group flex flex-col items-stretch",
                selected ? "border-primary shadow-green-100 scale-105" : (isCurrentUser ? "border-emerald-500 hover:border-emerald-600 shadow-md ring-2 ring-emerald-100" : "border-transparent hover:border-green-200")
            )}
        >
            {isCurrentUser && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-sm border border-emerald-500 uppercase tracking-wide">
                    Là Bạn
                </div>
            )}
            <Handle type="target" position={Position.Top} className="!bg-tree-line !w-3 !h-3" />

            {/* Content Row: Primary + [Partner] */}
            <div className="flex items-stretch divide-x divide-slate-100">
                {/* Add Child Button (Visible on Hover) */}
                {/* Warning: FamilyNode context doesn't have isViewer prop, let's inject it or useStore */}
                {/* Using useStore direct access for simplicity inside component */}

                {useStore.getState().currentFamily?.role !== 'VIEWER' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            useStore.getState().openAddMemberModal(data.primary.id, 'PARENT_CHILD');
                        }}
                        className="absolute -top-3 -right-3 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-emerald-600 hover:scale-110"
                        title="Thêm con (Tạo mới)"
                    >
                        <Plus size={14} />
                    </button>
                )}

                {/* Primary Member */}
                <MemberCard member={data.primary} />

                {/* Partner Member */}
                {data.partner && (
                    <MemberCard member={data.partner} />
                )}
            </div>

            {/* Stats Footer (Only if there are descendants) */}
            {totalDescendants > 0 && (
                <div className="bg-slate-50 border-t border-slate-100 px-3 py-1.5 flex items-center justify-center gap-4 rounded-b-xl">
                    <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1" title="Số con trực tiếp">
                        <User size={12} className="text-blue-500" />
                        <span>{totalChildren} con</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1" title="Tổng số hậu duệ (all levels)">
                        <UserPlus size={12} className="text-purple-500" />
                        <span>{totalDescendants} hậu duệ</span>
                    </div>
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="!bg-tree-line !w-3 !h-3 opacity-0" />

            {/* Toggle Button for Children */}
            {hasChildren && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(id);
                    }}
                    className={clsx(
                        "absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center cursor-pointer transition-colors z-20 shadow-sm",
                        isCollapsed ? "border-primary bg-primary text-white" : "border-slate-300 text-slate-500 hover:border-primary hover:text-primary"
                    )}
                >
                    {isCollapsed ? <Plus size={14} /> : <Minus size={14} />}
                </button>
            )}
        </div>
    );
};

export default memo(FamilyNode);
