import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Tag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';
import EditMemberModal from '../Member/EditMemberModal';
import ConfirmationModal from './ConfirmationModal';
import toast from 'react-hot-toast';

export default function MemberDetailPanel() {
    const {
        selectedMemberId,
        familyData,
        setSelectedMember,
        currentFamily,
        openAddRelationshipModal,
        currentUserMemberId,
        linkCurrentUserMember
    } = useStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

    const member = familyData.find(m => m.id === selectedMemberId);

    // Helper to resolve names
    const getNames = (ids: string[]) => {
        if (!ids || ids.length === 0) return [];
        return ids.map(id => {
            const m = familyData.find(fm => fm.id === id);
            return m ? m.name : 'Unknown';
        });
    };

    const handleClaimMember = async () => {
        if (!currentFamily || !member) return;
        try {
            await linkCurrentUserMember(currentFamily.id, member.id);
            toast.success("Đã xác nhận danh tính thành công!");
        } catch (error) {
            toast.error("Xác nhận thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <AnimatePresence>
            {selectedMemberId && member && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMember(null)}
                        className="fixed inset-0 bg-black z-40 md:bg-transparent md:pointer-events-none"
                    />

                    <motion.div
                        initial={{ x: '100%', y: '100%' }}
                        animate={{ x: 0, y: 0 }}
                        exit={{ x: '100%', y: '100%' }}
                        className={clsx(
                            "fixed z-50 bg-white shadow-2xl border-l border-slate-100 flex flex-col overflow-hidden",
                            "md:inset-y-0 md:right-0 md:w-96 md:h-full md:rounded-l-2xl", // Desktop
                            "inset-x-0 bottom-0 h-[60vh] rounded-t-2xl md:inset-auto" // Mobile
                        )}
                        variants={{
                            visible: { x: 0, y: 0 }
                        }}
                    >
                        <PanelContent
                            member={member}
                            onClose={() => setSelectedMember(null)}
                            onEdit={() => setIsEditModalOpen(true)}
                            onAddRelation={() => openAddRelationshipModal(member.id)}
                            onClaim={() => setIsClaimModalOpen(true)}
                            spouseNames={getNames(member.spouses)}
                            childrenNames={getNames(member.children)}
                            familyData={familyData}
                            setSelectedMember={setSelectedMember}
                            isCurrentUser={currentUserMemberId === member.id}
                            hasClaimedUser={!!currentUserMemberId}
                            isViewer={currentFamily?.role === 'VIEWER'}
                        />
                    </motion.div>

                    {currentFamily && (
                        <>
                            <EditMemberModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                member={member}
                                familyId={currentFamily.id}
                            />

                            <ConfirmationModal
                                isOpen={isClaimModalOpen}
                                onClose={() => setIsClaimModalOpen(false)}
                                onConfirm={handleClaimMember}
                                title="Xác nhận danh tính"
                                message={`Bạn có chắc chắn muốn xác nhận "${member.name}" là bạn trong cây phả hệ này không?`}
                                confirmText="Xác nhận là tôi"
                                type="info"
                            />
                        </>
                    )}
                </>
            )}
        </AnimatePresence>
    );
}

// Inner Content
const PanelContent = ({
    member,
    onClose,
    onEdit,
    onAddRelation,
    onClaim,
    // spouseNames, childrenNames removed
    familyData,
    setSelectedMember,
    isCurrentUser,
    hasClaimedUser,
    isViewer
}: {
    member: any,
    onClose: () => void,
    onEdit: () => void,
    onAddRelation: () => void,
    onClaim: () => void,
    spouseNames: string[],
    childrenNames: string[],
    familyData: any[], // Simple array type for now
    setSelectedMember: (id: string | null) => void,
    isCurrentUser: boolean,
    hasClaimedUser: boolean,
    isViewer: boolean
}) => {
    return (
        <div className="h-full flex flex-col relative bg-white font-sans text-slate-800">
            {/* Header Title */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Thông Tin Thành Viên</h3>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-4">
                    <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                        alt={member.name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">{member.name}</h2>
                            {isCurrentUser && (
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                                    Là tôi
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm mt-1">
                            Sinh năm {member.birthDate || '?'}
                            {member.deathDate && <span className="text-slate-400"> (Mất: {member.deathDate})</span>}
                        </p>

                        {/* Claim Button */}
                        {!isCurrentUser && !hasClaimedUser && !isViewer && (
                            <button
                                onClick={onClaim}
                                className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors border border-dashed border-emerald-300 flex items-center gap-1"
                            >
                                <User size={12} />
                                Xác nhận là tôi
                            </button>
                        )}

                        {!isCurrentUser && hasClaimedUser && (
                            <div className="mt-2 text-[10px] text-slate-400 italic">
                                Bạn đã được liên kết với một thành viên khác.
                            </div>
                        )}
                    </div>
                </div>

                {/* Info List */}
                <div className="space-y-4">
                    <InfoItem
                        icon={<User size={18} />}
                        label="Giới tính"
                        value={member.gender === 'MALE' ? 'Nam' : 'Nữ'}
                    />

                    {/* Spouses */}
                    {member.spouses && member.spouses.length > 0 && (
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Vợ / Chồng</h4>
                            <div className="space-y-2">
                                {member.spouses.map((spouseId: string) => { // Explicit type
                                    const spouse = familyData.find(m => m.id === spouseId);
                                    if (!spouse) return null;
                                    return (
                                        <div key={spouseId}
                                            className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all bg-white shadow-sm"
                                            onClick={() => setSelectedMember(spouse.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                                                    <img src={spouse.avatar || `https://ui-avatars.com/api/?name=${spouse.name}`} alt={spouse.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-700">{spouse.name}</div>
                                                    <div className="text-xs text-slate-400">{spouse.birthDate?.split('-')[0] || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Children */}
                    {member.children && member.children.length > 0 && (
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Con cái</h4>
                            {/* Indented List for Children */}
                            <div className="pl-3 border-l-2 border-slate-100 ml-1 space-y-2">
                                {member.children.map((childId: string) => { // Explicit type
                                    const child = familyData.find(m => m.id === childId);
                                    if (!child) return null;
                                    return (
                                        <div key={childId}
                                            className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all bg-white shadow-sm"
                                            onClick={() => setSelectedMember(child.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                                                    <img src={child.avatar || `https://ui-avatars.com/api/?name=${child.name}`} alt={child.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-700">{child.name}</div>
                                                    <div className="text-xs text-slate-400">{child.birthDate?.split('-')[0] || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Parents */}
                    {member.parents && member.parents.length > 0 && (
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cha / Mẹ</h4>
                            <div className="space-y-2">
                                {member.parents.map((parentId: string) => { // Explicit type
                                    const parent = familyData.find(m => m.id === parentId);
                                    if (!parent) return null;
                                    return (
                                        <div key={parentId}
                                            className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all bg-white shadow-sm"
                                            onClick={() => setSelectedMember(parent.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                                                    <img src={parent.avatar || `https://ui-avatars.com/api/?name=${parent.name}`} alt={parent.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-700">{parent.name}</div>
                                                    <div className="text-xs text-slate-400">{parent.birthDate?.split('-')[0] || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {member.bio && (
                        <InfoItem
                            icon={<Tag size={18} />}
                            label="Ghi chú"
                            value={member.bio}
                        />
                    )}

                    {/* Contact Info Display */}
                    {(member.phone || member.email || member.address || member.facebook || member.twitter) && (
                        <div className="pt-4 mt-2 border-t border-slate-100 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Thông tin liên hệ</h4>

                            {member.phone && <InfoItem icon={<span className="font-bold text-xs">Tel</span>} label="SĐT" value={member.phone} />}
                            {member.email && <InfoItem icon={<span className="font-bold text-xs">@</span>} label="Email" value={member.email} />}
                            {member.address && <InfoItem icon={<span className="font-bold text-xs">Đ/C</span>} label="Địa chỉ" value={member.address} />}

                            {/* Social Links */}
                            {(member.facebook || member.twitter) && (
                                <div className="flex gap-3 pt-2">
                                    {member.facebook && (
                                        <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded-full">
                                            Facebook
                                        </a>
                                    )}
                                    {member.twitter && (
                                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 text-sm flex items-center gap-1 font-medium bg-gray-100 px-2 py-1 rounded-full">
                                            X (Twitter)
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats Section */}
                    {(
                        (member.children && member.children.length > 0) ? (
                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {member.children.length}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">
                                        Số con
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-emerald-600">
                                        {(() => {
                                            const countDescendants = (ids: string[]): number => {
                                                if (!ids || ids.length === 0) return 0;
                                                let count = 0;
                                                ids.forEach(id => {
                                                    count++;
                                                    const m = familyData.find(fm => fm.id === id);
                                                    if (m && m.children) {
                                                        count += countDescendants(m.children);
                                                    }
                                                });
                                                return count;
                                            };
                                            return countDescendants(member.children);
                                        })()}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">
                                        Tổng hậu duệ
                                    </div>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            </div>

            {/* Footer Action */}
            {familyData.find(f => f.id === member.familyId /* Wait, member doesn't have familyId usually, use currentFamily */) && null}

            {/* Better way: pass isViewer prop or useStore */}
            {/* We already have useStore hook call inside MemberDetailPanel, let's pass down currentFamily to PanelContent or access role from store */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-3">
                {!isViewer && (
                    <>
                        <button
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition active:scale-[0.98]"
                            onClick={onAddRelation}
                        >
                            + Quan hệ
                        </button>
                        <button
                            className="flex-1 bg-emerald-700 text-white font-medium py-3 rounded-xl hover:bg-emerald-800 transition active:scale-[0.98] shadow-sm shadow-emerald-200"
                            onClick={onEdit}
                        >
                            Sửa
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex gap-3 items-start">
        <div className="w-8 flex justify-center mt-0.5 shrink-0">
            <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-emerald-600">
                {icon}
            </div>
        </div>
        <div className="flex-1 pt-1">
            <span className="font-semibold text-slate-700 mr-2">{label}:</span>
            <span className="text-slate-600 leading-relaxed">{value}</span>
        </div>
    </div>
)
