import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';
import { type FamilyMember } from '../../types';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: FamilyMember;
    familyId: string;
}

export default function EditMemberModal({ isOpen, onClose, member, familyId }: EditMemberModalProps) {
    const { updateMember, deleteMember, removeRelationship, familyData } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        gender: 'MALE' as 'MALE' | 'FEMALE',
        birthDate: '',
        deathDate: '',
        bio: '',
        avatar: '',
        phone: '',
        email: '',
        address: '',
        facebook: '',
        twitter: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name,
                gender: member.gender,
                birthDate: member.birthDate || '',
                deathDate: member.deathDate || '',
                bio: member.bio || '',
                avatar: member.avatar || '',
                phone: member.phone || '',
                email: member.email || '',
                address: member.address || '',
                facebook: member.facebook || '',
                twitter: member.twitter || ''
            });
        }
    }, [member]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateMember(familyId, member.id, formData);
            onClose();
        } catch (error) {
            console.error('Failed to update member:', error);
            alert('Failed to update member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Sửa Thông Tin Thành Viên</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={formData.gender === 'MALE'}
                                    onChange={() => setFormData({ ...formData, gender: 'MALE' })}
                                    className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-600">Nam</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={formData.gender === 'FEMALE'}
                                    onChange={() => setFormData({ ...formData, gender: 'FEMALE' })}
                                    className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-600">Nữ</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="YYYY hoặc YYYY-MM-DD"
                                value={formData.birthDate}
                                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày mất (nếu có)</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="YYYY hoặc YYYY-MM-DD"
                                value={formData.deathDate}
                                onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="https://example.com/avatar.jpg"
                            value={formData.avatar}
                            onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Thông tin liên hệ</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={(formData as any).phone || ''}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value } as any)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={(formData as any).email || ''}
                                    onChange={e => setFormData({ ...formData, email: e.target.value } as any)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={(formData as any).address || ''}
                                onChange={e => setFormData({ ...formData, address: e.target.value } as any)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={(formData as any).facebook || ''}
                                    onChange={e => setFormData({ ...formData, facebook: e.target.value } as any)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">X (Twitter)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={(formData as any).twitter || ''}
                                    onChange={e => setFormData({ ...formData, twitter: e.target.value } as any)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tiểu sử</label>
                        <textarea
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    {/* Relationship Management Section */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Quản lý Mối Quan Hệ</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">

                            {/* Spouses */}
                            {member.spouses && member.spouses.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Vợ / Chồng</h4>
                                    <div className="space-y-2">
                                        {member.spouses.map(spouseId => {
                                            const spouse = familyData.find(m => m.id === spouseId);
                                            if (!spouse) return null;
                                            return (
                                                <div key={spouseId}
                                                    className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg border border-slate-200 group"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${spouse.gender === 'MALE' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                                        <span className="font-medium text-slate-700">{spouse.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm(`Bạn có chắc muốn xóa quan hệ giữa ${member.name} và ${spouse.name}?`)) {
                                                                removeRelationship(familyId, member.id, spouse.id)
                                                                    .catch(() => alert("Xóa quan hệ thất bại"));
                                                            }
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Xóa quan hệ"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Children */}
                            {member.children && member.children.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Con cái</h4>
                                    <div className="space-y-2 pl-2 border-l-2 border-slate-100 ml-1">
                                        {member.children.map(childId => {
                                            const child = familyData.find(m => m.id === childId);
                                            if (!child) return null;
                                            return (
                                                <div key={childId}
                                                    className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg border border-slate-200 group"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${child.gender === 'MALE' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                                        <span className="font-medium text-slate-700">{child.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm(`Bạn có chắc muốn xóa quan hệ cha/mẹ - con với ${child.name}?`)) {
                                                                removeRelationship(familyId, member.id, child.id)
                                                                    .catch(() => alert("Xóa quan hệ thất bại"));
                                                            }
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Xóa quan hệ"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Parents */}
                            {member.parents && member.parents.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Cha / Mẹ</h4>
                                    <div className="space-y-2">
                                        {member.parents.map(parentId => {
                                            const parent = familyData.find(m => m.id === parentId);
                                            if (!parent) return null;
                                            return (
                                                <div key={parentId}
                                                    className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg border border-slate-200 group"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${parent.gender === 'MALE' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                                        <span className="font-medium text-slate-700">{parent.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm(`Bạn có chắc muốn xóa quan hệ cha/mẹ - con với ${parent.name}?`)) {
                                                                removeRelationship(familyId, parent.id, member.id)
                                                                    .catch(() => alert("Xóa quan hệ thất bại"));
                                                            }
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Xóa quan hệ"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={async () => {
                                if (confirm("CẢNH BÁO: Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa thành viên này và tất cả mối quan hệ liên quan?")) {
                                    try {
                                        await deleteMember(familyId, member.id);
                                        onClose();
                                    } catch (e) {
                                        alert("Xóa thất bại");
                                    }
                                }
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg mr-auto"
                        >
                            Xóa Thành Viên
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? 'Lưu thay đổi' : 'Lưu thông tin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
