import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { X, User, Shield, Trash2, MoreVertical } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface FamilyMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FamilyMembersModal({ isOpen, onClose }: FamilyMembersModalProps) {
    const { currentFamily, familyMembers, fetchFamilyMembers, removeFamilyMember, updateFamilyMemberRole, user } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && currentFamily) {
            fetchFamilyMembers(currentFamily.id);
        }
    }, [isOpen, currentFamily, fetchFamilyMembers]);

    if (!isOpen || !currentFamily) return null;

    const isOwner = currentFamily.role === 'OWNER';

    const handleRemove = async (userId: string) => {
        if (confirm('Bạn có chắc muốn xóa thành viên này khỏi gia phả?')) {
            await removeFamilyMember(currentFamily.id, userId);
            fetchFamilyMembers(currentFamily.id); // Refresh
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'OWNER' | 'EDITOR' | 'VIEWER') => {
        await updateFamilyMemberRole(currentFamily.id, userId, newRole);
        fetchFamilyMembers(currentFamily.id);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Quản lý thành viên</h2>
                                    <p className="text-xs text-gray-400">{familyMembers.length} người tham gia</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="space-y-1">
                                {familyMembers.map((member) => (
                                    <div key={member.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold uppercase">
                                                {member.name?.[0] || <User size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{member.name}</div>
                                                <div className="text-xs text-gray-400">{member.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                member.role === 'OWNER' ? "bg-purple-100 text-purple-600" :
                                                    member.role === 'EDITOR' ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                            )}>
                                                {member.role === 'OWNER' ? 'Chủ sở hữu' : member.role === 'EDITOR' ? 'Chỉnh sửa' : 'Xem'}
                                            </span>

                                            {isOwner && member.userId !== user?.id && (
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger asChild>
                                                        <button className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content className="bg-white rounded-xl shadow-xl border border-gray-100 p-1 min-w-[150px] z-[110]" align="end">
                                                            <DropdownMenu.Label className="text-[10px] uppercase text-gray-400 font-bold px-2 py-1">Đổi quyền</DropdownMenu.Label>
                                                            <DropdownMenu.Item onClick={() => handleRoleChange(member.userId, 'EDITOR')} className="text-sm px-2 py-1.5 hover:bg-blue-50 text-gray-700 rounded-lg cursor-pointer outline-none">
                                                                Cấp quyền Sửa
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item onClick={() => handleRoleChange(member.userId, 'VIEWER')} className="text-sm px-2 py-1.5 hover:bg-gray-50 text-gray-700 rounded-lg cursor-pointer outline-none">
                                                                Cấp quyền Xem
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
                                                            <DropdownMenu.Item onClick={() => handleRemove(member.userId)} className="text-sm px-2 py-1.5 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer outline-none flex items-center gap-2">
                                                                <Trash2 size={14} /> Xóa khỏi gia phả
                                                            </DropdownMenu.Item>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
