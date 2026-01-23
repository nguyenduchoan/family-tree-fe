import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Search, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function MemberSearch() {
    const { familyData, setFocusMember } = useStore();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter members based on query
    const filteredMembers = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return familyData.filter(member =>
            member.name.toLowerCase().includes(lowerQuery) ||
            member.nickname?.toLowerCase().includes(lowerQuery)
        ).slice(0, 10); // Limit results
    }, [query, familyData]);

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (memberId: string) => {
        setFocusMember(memberId);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm thành viên..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none text-sm transition-all"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setFocusMember(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (query || filteredMembers.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[300px] overflow-y-auto z-[60]"
                    >
                        {filteredMembers.length > 0 ? (
                            <div className="py-2">
                                {filteredMembers.map(member => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleSelect(member.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-gray-50 last:border-none"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                member.name[0]
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">{member.name}</div>
                                            {member.nickname && (
                                                <div className="text-xs text-gray-500">({member.nickname})</div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                Không tìm thấy thành viên "{query}"
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
