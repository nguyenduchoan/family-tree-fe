"use client";

import { X, User, Calendar, MapPin, Heart, Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

export function MemberDetailPanel() {
    const {
        selectedMemberId,
        familyData,
        setSelectedMember,
        currentFamily,
        openAddRelationshipModal,
        openAddMemberModal,
        openEditMemberModal,
        currentUserMemberId
    } = useStore();

    const member = familyData.find(m => m.id === selectedMemberId);

    if (!selectedMemberId || !member) return null;

    const isViewer = currentFamily?.role === 'VIEWER';

    // Helper to get formatted name groups
    const getSpouseGroups = () => {
        if (!member.spouses || member.spouses.length === 0) return [];
        return member.spouses.map(id => familyData.find(m => m.id === id)).filter(Boolean).map(m => ({ primary: m, spouses: [] }));
    };

    const getChildrenGroups = () => {
        if (!member.children || member.children.length === 0) return [];
        return member.children.map(childId => {
            const child = familyData.find(m => m.id === childId);
            if (!child) return null;

            // Find spouses of this child
            const spouses = (child.spouses || [])
                .map(sId => familyData.find(m => m.id === sId))
                .filter(Boolean);

            return { primary: child, spouses };
        }).filter(Boolean);
    };

    const getParentGroups = () => {
        if (!member.parents || member.parents.length === 0) return [];
        return member.parents.map(id => familyData.find(m => m.id === id)).filter(Boolean).map(m => ({ primary: m, spouses: [] }));
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
                onClick={() => setSelectedMember(null)}
            />

            {/* Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-xl z-[60] shadow-2xl transition-transform duration-300 transform animate-in slide-in-from-right",
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white/50">
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Chi tiết thành viên</h2>
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col items-center relative">
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-blue-100 to-purple-100 border border-white shadow-xl mb-4 relative group cursor-pointer overflow-hidden">
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-gray-300">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                                <div className={cn(
                                    "absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                                    member.gender === 'MALE' ? "bg-blue-500" : "bg-pink-500"
                                )}>
                                    <User size={12} className="text-white" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 text-center">{member.name}</h3>
                            {member.nickname && (
                                <p className="text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full text-sm mt-2">
                                    "{member.nickname}"
                                </p>
                            )}

                            {member.id === currentUserMemberId && (
                                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-0.5 rounded shadow-sm">
                                    Là Bạn
                                </span>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-4">
                            <InfoCard
                                icon={<Calendar className="w-5 h-5 text-blue-500" />}
                                label="Ngày sinh"
                                value={member.birthDate}
                                subValue={member.birthPlace}
                            />

                            {member.deathDate && (
                                <InfoCard
                                    icon={<div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full opacity-50" /></div>}
                                    label="Ngày mất"
                                    value={member.deathDate}
                                    className="bg-gray-50 border-gray-200"
                                />
                            )}

                            <InfoCard
                                icon={<MapPin className="w-5 h-5 text-orange-500" />}
                                label="Địa chỉ / Quê quán"
                                value={member.address}
                            />
                        </div>

                        {/* Relationships */}
                        <div className="space-y-6 pt-4 border-t border-gray-100">
                            {/* Spouses */}
                            <RelationshipSection
                                title="Vợ / Chồng"
                                color="pink"
                                groups={getSpouseGroups()}
                                onSelect={(id: string) => setSelectedMember(id)}
                            />

                            {/* Parents */}
                            <RelationshipSection
                                title="Cha / Mẹ"
                                color="blue"
                                groups={getParentGroups()}
                                onSelect={(id: string) => setSelectedMember(id)}
                            />

                            {/* Children */}
                            <RelationshipSection
                                title="Con cái"
                                color="emerald"
                                groups={getChildrenGroups()}
                                onSelect={(id: string) => setSelectedMember(id)}
                            />
                        </div>

                        {/* Bio */}
                        {member.bio && (
                            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase flex items-center gap-2">
                                    <Edit size={14} /> Tiểu sử
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-sm italic">
                                    "{member.bio}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {!isViewer && (
                        <div className="p-5 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => openAddMemberModal(member.id, 'PARENT_CHILD')} // Assuming adding child relative to this member? Or reuse AddRelationship? 
                                // Actually AddMember logic: Add someone relative to this person.
                                // Logic in AddMemberModal expects relatedMemberId and handles types.
                                // If I want to add a child to this person:
                                // openAddMemberModal(member.id, 'PARENT_CHILD')
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <Plus size={18} /> Thêm thành viên
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditMemberModal(member.id);
                                }}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                            >
                                <Edit size={18} /> Chỉnh sửa
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function InfoCard({ icon, label, value, subValue, className }: any) {
    if (!value && !subValue) return null;
    return (
        <div className={cn("flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-hover hover:border-gray-200 hover:shadow-md", className)}>
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <div className="font-bold text-gray-800">{value || "---"}</div>
                {subValue && <div className="text-sm text-gray-500 mt-1">{subValue}</div>}
            </div>
        </div>
    );
}

function RelationshipSection({ title, color, groups, onSelect }: any) {
    if (!groups || groups.length === 0) return null;

    const colorStyles: any = {
        pink: "border-l-4 border-pink-400 bg-pink-50/50 hover:bg-pink-50",
        blue: "border-l-4 border-blue-400 bg-blue-50/50 hover:bg-blue-50",
        emerald: "border-l-4 border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50"
    };

    return (
        <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                {title}
                <span className="bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full">{groups.length}</span>
            </h4>
            <div className="flex flex-col gap-2">
                {groups.map((group: any) => {
                    const { primary, spouses } = group;
                    return (
                        <div
                            key={primary.id}
                            className={cn(
                                "flex flex-col gap-2 p-2 rounded-xl border border-gray-100 shadow-sm transition-all group-hover:shadow-md",
                                colorStyles[color] || "bg-gray-50"
                            )}
                        >
                            {/* Primary Member */}
                            <MemberRow member={primary} onSelect={onSelect} />

                            {/* Spouses (Nested) */}
                            {spouses && spouses.length > 0 && (
                                <div className="ml-8 pl-3 border-l-2 border-dashed border-gray-300 space-y-2">
                                    {spouses.map((spouse: any) => (
                                        <MemberRow key={spouse.id} member={spouse} onSelect={onSelect} isSpouse />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const MemberRow = ({ member, onSelect, isSpouse }: { member: any, onSelect: (id: string) => void, isSpouse?: boolean }) => (
    <div
        onClick={(e) => { e.stopPropagation(); onSelect(member.id); }}
        className={cn(
            "flex items-center gap-3 cursor-pointer group/row",
            isSpouse ? "opacity-90 hover:opacity-100" : ""
        )}
    >
        <div className="shrink-0 relative">
            {member.avatar ? (
                <img src={member.avatar} className={cn("rounded-full object-cover border border-white shadow-sm", isSpouse ? "w-8 h-8" : "w-10 h-10")} />
            ) : (
                <div className={cn("rounded-full bg-white flex items-center justify-center text-gray-300 border border-gray-100", isSpouse ? "w-8 h-8" : "w-10 h-10")}>
                    <User size={isSpouse ? 14 : 18} />
                </div>
            )}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <div className={cn("font-bold text-gray-800 truncate group-hover/row:text-primary transition-colors", isSpouse ? "text-xs" : "text-sm")}>
                    {member.name}
                </div>
                {isSpouse && <span className="text-[10px] bg-pink-100 text-pink-600 px-1.5 rounded-sm font-bold">Dâu/Rể</span>}
            </div>
            {(member.birthDate || member.deathDate) && (
                <div className="text-[10px] text-gray-400 mt-0.5">
                    {member.birthDate ? member.birthDate.split('-')[0] : '?'}
                    {member.deathDate ? ` - ${member.deathDate.split('-')[0]}` : ''}
                </div>
            )}
        </div>
    </div>
);
