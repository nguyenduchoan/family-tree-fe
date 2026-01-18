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
                member.gender === 'male' ? "bg-blue-400" : "bg-pink-400"
            )} />
        </div>
    )
}

const FamilyNode = ({ id, data, selected }: NodeProps<FamilyNodeData>) => {
    const { collapsedNodes, toggleCollapse } = useStore();
    const isCollapsed = collapsedNodes.includes(id);
    const hasChildren = data.children && data.children.length > 0;

    return (
        <div
            className={clsx(
                "bg-white rounded-xl shadow-lg border-2 transition-all duration-300 relative group flex items-stretch divide-x divide-slate-100",
                selected ? "border-primary shadow-green-100 scale-105" : "border-transparent hover:border-green-200"
            )}
        >
            <Handle type="target" position={Position.Top} className="!bg-tree-line !w-3 !h-3" />

            {/* Add Child Button (Visible on Hover) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    alert(`Tính năng thêm con cho ${data.primary.name} sẽ sớm ra mắt!`);
                }}
                className="absolute -top-3 -right-3 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-emerald-600 hover:scale-110"
                title="Thêm con"
            >
                <UserPlus size={14} />
            </button>

            {/* Primary Member */}
            <MemberCard member={data.primary} />

            {/* Partner Member */}
            {data.partner && (
                <MemberCard member={data.partner} />
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
