import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';


export default function AddRelationshipModal() {
    const {
        familyData,
        currentFamily,
        addRelationship,
        addRelationshipModal,
        closeAddRelationshipModal
    } = useStore();

    const { isOpen, sourceMemberId, initialType } = addRelationshipModal;

    const [targetMemberId, setTargetMemberId] = useState('');
    const [relationshipType, setRelationshipType] = useState<'SPOUSE' | 'PARENT_CHILD'>(initialType);
    const [isLoading, setIsLoading] = useState(false);

    const currentMember = familyData.find(m => m.id === sourceMemberId);

    useEffect(() => {
        if (isOpen) {
            setRelationshipType(initialType);
            setTargetMemberId('');
        }
    }, [isOpen, initialType]);

    if (!isOpen || !currentMember || !currentFamily) return null;

    const [searchTerm, setSearchTerm] = useState('');

    // Filter out current member and existing relationships to avoid duplicates (basic filtering)
    // For now, just filter out self.
    const availableMembers = familyData
        .filter(m => m.id !== currentMember.id)
        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetMemberId) return;

        setIsLoading(true);
        try {
            await addRelationship(currentFamily.id, currentMember.id, targetMemberId, relationshipType);
            closeAddRelationshipModal();
            setTargetMemberId('');
            setSearchTerm('');
        } catch (error) {
            console.error('Failed to add relationship:', error);
            alert('Failed to add relationship');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Thêm Mối Quan Hệ</h2>
                    <button onClick={closeAddRelationshipModal} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <p className="text-sm text-slate-500 mb-2">Thêm quan hệ cho: <span className="font-bold text-slate-800">{currentMember.name}</span></p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Loại quan hệ</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            value={relationshipType}
                            onChange={e => setRelationshipType(e.target.value as 'SPOUSE' | 'PARENT_CHILD')}
                        >
                            <option value="SPOUSE">Vợ / Chồng</option>
                            <option value="PARENT_CHILD">Con cái (Người này là cha/mẹ của...)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                            {relationshipType === 'SPOUSE'
                                ? `${currentMember.name} là vợ/chồng của người được chọn.`
                                : `${currentMember.name} là CHA/MẸ của người được chọn.`
                            }
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Chọn thành viên</label>

                        {/* Search Input */}
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            required
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            value={targetMemberId}
                            onChange={e => setTargetMemberId(e.target.value)}
                            size={5} // Show multiple items to make it easier to see search results
                        >
                            <option value="" disabled>-- Kết quả tìm kiếm ({availableMembers.length}) --</option>
                            {availableMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.gender === 'MALE' ? 'Nam' : 'Nữ'}, {member.birthDate || '?'})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-400 mt-1">* Nhập tên để lọc danh sách bên dưới</p>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeAddRelationshipModal}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!targetMemberId || isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? 'Đang thêm...' : 'Thêm quan hệ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
