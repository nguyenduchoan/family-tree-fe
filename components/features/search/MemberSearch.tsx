import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Search, User, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function MemberSearch() {
    const familyData = useStore(state => state.familyData);
    const setFocusMember = useStore(state => state.setFocusMember);

    // Debug: Check if setFocusMember is defined
    useEffect(() => {
        if (!setFocusMember) {
            console.error("CRITICAL: setFocusMember is undefined in MemberSearch!");
        }
    }, [setFocusMember]);

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Helper to remove accents for Vietnamese search
    const removeAccents = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    };

    // Filter members based on query
    const filteredMembers = useMemo(() => {
        if (!query.trim()) return [];
        const normalizedQuery = removeAccents(query.toLowerCase());

        return familyData.filter(member => {
            const name = removeAccents(member.name.toLowerCase());
            const nickname = member.nickname ? removeAccents(member.nickname.toLowerCase()) : '';
            return name.includes(normalizedQuery) || nickname.includes(normalizedQuery);
        }).slice(0, 10);
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
        if (setFocusMember) {
            setFocusMember(memberId);
            setQuery('');
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md mx-auto group z-50">
            <div className="relative transform transition-all duration-300">
                <div className={cn(
                    "relative flex items-center px-4 py-2.5 rounded-2xl border transition-all duration-300",
                    "bg-white/40 backdrop-blur-md border-white/40 shadow-sm hover:shadow-md",
                    "focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:bg-white/60 focus-within:border-emerald-500/30",
                    isOpen && filteredMembers.length > 0 ? "rounded-b-none" : ""
                )}>
                    <Search className="text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm thành viên..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="w-full bg-transparent border-none outline-none px-3 text-gray-700 placeholder:text-gray-400 font-medium"
                    />
                    {query && (
                        <button
                            onClick={() => {
                                setQuery('');
                                inputRef.current?.focus();
                            }}
                            className="p-1 hover:bg-gray-200/50 rounded-full text-gray-400 hover:text-gray-600 transition-all"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isOpen && filteredMembers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl rounded-t-sm shadow-xl overflow-hidden max-h-80 overflow-y-auto"
                        >
                            <div className="p-2 space-y-1">
                                {filteredMembers.map((member) => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleSelect(member.id)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/80 transition-all group/item text-left border border-transparent hover:border-emerald-100"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-white font-bold text-sm",
                                            member.gender === 'MALE'
                                                ? "bg-gradient-to-br from-blue-400 to-blue-600"
                                                : "bg-gradient-to-br from-pink-400 to-pink-600"
                                        )}>
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                member.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-gray-800 font-semibold truncate group-hover/item:text-emerald-700 transition-colors">
                                                {member.name}
                                            </h4>
                                            {member.nickname && (
                                                <p className="text-xs text-gray-500 truncate">Waitlist: {member.nickname}</p>
                                            )}
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover/item:text-emerald-500 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
