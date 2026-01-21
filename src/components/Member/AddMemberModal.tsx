import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';

export default function AddMemberModal() {
    const { addMember, addMemberModal, closeAddMemberModal, familyData } = useStore();
    const { isOpen, relatedMemberId, relationType } = addMemberModal;

    // Derived state from global store context
    // If opened from a node, relatedMemberId is pre-set.
    const preSelectedMember = relatedMemberId ? familyData.find(m => m.id === relatedMemberId) : null;

    const [formData, setFormData] = useState({
        name: '',
        gender: 'MALE' as 'MALE' | 'FEMALE',
        birthDate: '',
        deathDate: '',
        bio: '',
        avatar: ''
    });

    // Relationship State
    const [useRelationship, setUseRelationship] = useState(!!relatedMemberId);
    const [selectedTargetId, setSelectedTargetId] = useState(relatedMemberId || '');
    const [selectedType, setSelectedType] = useState<'SPOUSE' | 'PARENT_CHILD'>(relationType || 'SPOUSE');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
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

    if (!isOpen) return null;

    // Available members for relationship selection (exclude empty if creating fresh)
    const availableMembers = familyData;
    const currentFamilyId = useStore.getState().currentFamily?.id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFamilyId) return;

        setIsLoading(true);
        try {
            // Prepare relationship data if enabled
            const relationshipData = (useRelationship && selectedTargetId) ? {
                targetId: selectedTargetId,
                type: selectedType
            } : undefined;

            await addMember(currentFamilyId, formData, relationshipData);

            closeAddMemberModal();
        } catch (error) {
            console.error('Failed to add member:', error);
            alert('Failed to add member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {preSelectedMember ? `Thêm người thân cho ${preSelectedMember.name}` : 'Thêm Thành Viên Mới'}
                    </h2>
                    <button onClick={closeAddMemberModal} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-6">
                    <form id="add-member-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1">Thông tin cá nhân</h3>
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
                                            placeholder="09xxx..."
                                            value={(formData as any).phone || ''}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value } as any)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="example@mail.com"
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
                                        placeholder="Hà Nội, Việt Nam"
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
                                            placeholder="URL Facebook profile"
                                            value={(formData as any).facebook || ''}
                                            onChange={e => setFormData({ ...formData, facebook: e.target.value } as any)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">X (Twitter)</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="URL X profile"
                                            value={(formData as any).twitter || ''}
                                            onChange={e => setFormData({ ...formData, twitter: e.target.value } as any)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Relationship Info */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-1">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mối Quan Hệ (Tùy chọn)</h3>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={useRelationship}
                                            onChange={(e) => setUseRelationship(e.target.checked)}
                                        />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${useRelationship ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useRelationship ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <span className="ml-2 text-xs text-slate-500">Kích hoạt</span>
                                </label>
                            </div>

                            {useRelationship && (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Người liên quan</label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                            value={selectedTargetId}
                                            onChange={e => setSelectedTargetId(e.target.value)}
                                            disabled={!!relatedMemberId} // Disable if pre-selected via context
                                        >
                                            <option value="">-- Chọn thành viên --</option>
                                            {availableMembers.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} ({m.gender === 'MALE' ? 'Nam' : 'Nữ'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Loại quan hệ</label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                            value={selectedType}
                                            onChange={e => setSelectedType(e.target.value as any)}
                                        >
                                            <option value="SPOUSE">Vợ / Chồng</option>
                                            <option value="PARENT_CHILD">Con cái (Người mới là con của...)</option>
                                        </select>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {selectedTargetId && (
                                                selectedType === 'SPOUSE'
                                                    ? `Người mới sẽ là VỢ/CHỒNG của ${familyData.find(m => m.id === selectedTargetId)?.name}`
                                                    : `Người mới sẽ là CON của ${familyData.find(m => m.id === selectedTargetId)?.name}`
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={closeAddMemberModal}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="add-member-form"
                        disabled={isLoading || (useRelationship && !selectedTargetId)}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? 'Đang thêm...' : 'Thêm thành viên'}
                    </button>
                </div>
            </div>
        </div>
    );
}
