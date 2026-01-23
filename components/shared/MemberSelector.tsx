import { useState, useMemo } from 'react';
import { Search, User as UserIcon, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface MemberSelectorProps {
    excludeIds?: string[];
    onSelect: (memberId: string) => void;
    onCancel: () => void;
    onCreateNew?: () => void;
    placeholder?: string;
}

export default function MemberSelector({ excludeIds = [], onSelect, onCancel, onCreateNew, placeholder = "Tìm thành viên..." }: MemberSelectorProps) {
    const { familyData } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = useMemo(() => {
        return familyData
            .filter(m => !excludeIds.includes(m.id))
            .filter(m =>
                (m.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (m.nickname?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
    }, [familyData, excludeIds, searchQuery]);

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    autoFocus
                    type="text"
                    className="w-full pl-9 pr-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent space-y-1">
                {filteredMembers.length === 0 ? (
                    <div className="p-3 text-center text-sm text-gray-400">Không tìm thấy thành viên nào</div>
                ) : (
                    filteredMembers.map(member => (
                        <button
                            key={member.id}
                            type="button"
                            onClick={() => onSelect(member.id)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-blue-50/80 rounded-lg transition-colors text-left group"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${member.gender === 'MALE' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                                }`}>
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <UserIcon size={14} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">{member.name}</div>
                                {member.nickname && <div className="text-xs text-gray-400 truncate">({member.nickname})</div>}
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="pt-2 border-t border-gray-100 mt-1 space-y-1">
                {onCreateNew && (
                    <button
                        type="button"
                        onClick={onCreateNew}
                        className="w-full py-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> Thêm thành viên mới
                    </button>
                )}
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Hủy bỏ
                </button>
            </div>
        </div>
    );
}
