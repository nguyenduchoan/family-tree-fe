import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { X, Save } from 'lucide-react';

export default function EditMemberModal() {
    const { updateMember, editMemberModal, closeEditMemberModal, familyData, currentFamily } = useStore();
    const { isOpen, memberId } = editMemberModal;

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: 'MALE' as 'MALE' | 'FEMALE',
        birthDate: '',
        deathDate: '',
        bio: '',
        avatar: '',
        address: '',
        birthPlace: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && memberId) {
            const member = familyData.find(m => m.id === memberId);
            if (member) {
                setFormData({
                    name: member.name || '',
                    nickname: member.nickname || '',
                    gender: (member.gender as any) || 'MALE',
                    birthDate: member.birthDate || '',
                    deathDate: member.deathDate || '',
                    bio: member.bio || '',
                    avatar: member.avatar || '',
                    address: member.address || '',
                    birthPlace: (member as any).birthPlace || ''
                });
            }
        }
    }, [isOpen, memberId, familyData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFamily || !memberId) return;
        setIsLoading(true);
        try {
            await updateMember(currentFamily.id, memberId, formData);
            closeEditMemberModal();
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật thành viên');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="glass-card bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Chỉnh Sửa Thông Tin</h2>
                    <button onClick={closeEditMemberModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <form id="edit-member-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và Tên</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    placeholder="Nhập họ tên đầy đủ"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Biệt danh</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                                    <div className="flex gap-4 pt-1">
                                        <label className="relative flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="MALE"
                                                checked={formData.gender === 'MALE'}
                                                onChange={() => setFormData({ ...formData, gender: 'MALE' })}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Nam</span>
                                        </label>
                                        <label className="relative flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-pink-50/50 transition-colors">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="FEMALE"
                                                checked={formData.gender === 'FEMALE'}
                                                onChange={() => setFormData({ ...formData, gender: 'FEMALE' })}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-pink-500 peer-checked:bg-pink-500 transition-all flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">Nữ</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        placeholder="YYYY"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày mất</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        placeholder="YYYY"
                                        value={formData.deathDate}
                                        onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Quê quán / Nơi sinh</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    value={formData.birthPlace}
                                    onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ hiện tại</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiểu sử</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
                                    placeholder="Thêm ghi chú về thành viên..."
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Avatar (URL)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    placeholder="https://..."
                                    value={formData.avatar}
                                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/50 backdrop-blur-md flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={closeEditMemberModal}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="edit-member-form"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                    >
                        {isLoading ? 'Đang lưu...' : <><Save size={18} /> Lưu thay đổi</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
