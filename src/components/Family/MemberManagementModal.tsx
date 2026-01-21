import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Trash2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface MemberManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MemberManagementModal: React.FC<MemberManagementModalProps> = ({ isOpen, onClose }) => {
    const {
        currentFamily,
        familyMembers,
        fetchFamilyMembers,
        user,
        removeFamilyMember,
        updateFamilyMemberRole,
        leaveFamily
    } = useStore();

    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (isOpen && currentFamily) {
            fetchFamilyMembers(currentFamily.id);
        }
    }, [isOpen, currentFamily, fetchFamilyMembers]);

    if (!isOpen || !currentFamily) return null;

    const currentUserMember = familyMembers.find(m => m.userId === user?.id);
    const isOwner = currentUserMember?.role === 'OWNER';

    const handleLeaveFamily = async () => {
        if (!confirm('Bạn có chắc chắn muốn rời khỏi gia phả này?')) return;
        setIsLeaving(true);
        try {
            await leaveFamily(currentFamily.id);
            toast.success('Đã rời gia phả thành công');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể rời gia phả');
        } finally {
            setIsLeaving(false);
        }
    };

    const handleRemoveMember = async (userId: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}" khỏi gia phả?`)) return;
        try {
            await removeFamilyMember(currentFamily.id, userId);
            toast.success('Đã xóa thành viên thành công');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể xóa thành viên');
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'OWNER' | 'EDITOR' | 'VIEWER') => {
        try {
            await updateFamilyMemberRole(currentFamily.id, userId, newRole);
            toast.success('Đã cập nhật quyền thành công');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật quyền');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Quản lý Thành viên</h2>
                        <p className="text-sm text-slate-500">{currentFamily.name} • {familyMembers.length} thành viên</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 flex-1">
                    {familyMembers.map((member) => (
                        <div key={member.userId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border hover:border-slate-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <img
                                    src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                                    alt={member.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        {member.name}
                                        {member.userId === user?.id && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Bạn</span>}
                                    </h3>
                                    <p className="text-xs text-slate-500">{member.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isOwner && member.userId !== user?.id ? (
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.userId, e.target.value as any)}
                                        className="text-sm bg-white border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="VIEWER">Viewer</option>
                                        <option value="EDITOR">Editor</option>
                                        <option value="OWNER">Owner</option>
                                    </select>
                                ) : (
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${member.role === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                                        member.role === 'EDITOR' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-slate-200 text-slate-600'
                                        }`}>
                                        {member.role}
                                    </span>
                                )}

                                {isOwner && member.userId !== user?.id && (
                                    <button
                                        onClick={() => handleRemoveMember(member.userId, member.name)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa thành viên"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t bg-slate-50 rounded-b-2xl">
                    <button
                        onClick={handleLeaveFamily}
                        disabled={isLeaving}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors w-full justify-center md:w-auto"
                    >
                        <LogOut size={18} />
                        Rời khỏi gia phả này
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberManagementModal;
