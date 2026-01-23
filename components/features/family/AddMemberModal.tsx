import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddMemberModal() {
    const { addMember, addMemberModal, closeAddMemberModal, familyData, currentFamily } = useStore();
    const { isOpen, relatedMemberId, relationType } = addMemberModal;

    // Derived state from global store context
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: 'MALE' as 'MALE' | 'FEMALE',
        birthDate: '',
        deathDate: '',
        bio: '',
        avatar: ''
    });

    const [useRelationship, setUseRelationship] = useState(false);
    const [selectedTargetId, setSelectedTargetId] = useState('');
    const [selectedType, setSelectedType] = useState<'SPOUSE' | 'PARENT_CHILD'>('SPOUSE');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                nickname: '',
                gender: 'MALE',
                birthDate: '',
                deathDate: '',
                bio: '',
                avatar: ''
            });
            setUseRelationship(!!relatedMemberId);
            setSelectedTargetId(relatedMemberId || '');
            setSelectedType(relationType || 'SPOUSE');
        }
    }, [isOpen, relatedMemberId, relationType]);

    const availableMembers = familyData;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFamily) return;
        setIsLoading(true);
        try {
            await addMember(
                currentFamily.id,
                formData,
                useRelationship && selectedTargetId ? {
                    targetId: selectedTargetId,
                    type: selectedType
                } : undefined
            );
            toast.success('Thêm thành viên thành công!');
            closeAddMemberModal();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm thành viên');
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
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Thêm Thành Viên Mới</h2>
                    <button onClick={closeAddMemberModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <form id="add-member-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Basic Info */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và Tên</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                                    placeholder="Nhập họ tên đầy đủ"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Biệt danh</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                                    placeholder="Ví dụ: Cún, Tèo..."
                                    value={formData.nickname}
                                    onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                                <div className="flex gap-4">
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

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                                        placeholder="YYYY"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày mất (nếu có)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                                        placeholder="YYYY"
                                        value={formData.deathDate}
                                        onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Relationship Info */}
                        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Mối Quan Hệ
                                </h3>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={useRelationship}
                                            onChange={(e) => setUseRelationship(e.target.checked)}
                                        />
                                        <div className={`block w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${useRelationship ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm ${useRelationship ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600 font-medium">Kích hoạt</span>
                                </label>
                            </div>

                            {useRelationship && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Kết nối với</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                                                value={selectedTargetId}
                                                onChange={e => setSelectedTargetId(e.target.value)}
                                                disabled={!!relatedMemberId}
                                            >
                                                <option value="">-- Chọn thành viên --</option>
                                                {availableMembers.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Là</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <label className={`
                                                flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                                                ${selectedType === 'SPOUSE' ? 'border-pink-400 bg-pink-50 text-pink-700 shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
                                            `}>
                                                <input type="radio" value="SPOUSE" checked={selectedType === 'SPOUSE'} onChange={() => setSelectedType('SPOUSE')} className="sr-only" />
                                                <span className="font-bold">Vợ / Chồng</span>
                                                <span className="text-[10px] mt-1 text-center opacity-80">Người được chọn</span>
                                            </label>
                                            <label className={`
                                                flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                                                ${selectedType === 'PARENT_CHILD' ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}
                                            `}>
                                                <input type="radio" value="PARENT_CHILD" checked={selectedType === 'PARENT_CHILD'} onChange={() => setSelectedType('PARENT_CHILD')} className="sr-only" />
                                                <span className="font-bold">Con cái</span>
                                                <span className="text-[10px] mt-1 text-center opacity-80">Người mới là con</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/50 backdrop-blur-md flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={closeAddMemberModal}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="add-member-form"
                        disabled={isLoading || (useRelationship && !selectedTargetId)}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Thêm thành viên'}
                    </button>
                </div>
            </div>
        </div>
    );
}
