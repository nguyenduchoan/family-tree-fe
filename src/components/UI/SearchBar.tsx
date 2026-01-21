import { useState, useMemo } from 'react';
import { useReactFlow } from 'reactflow';
import { Search, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
    const { familyData, setSelectedMember } = useStore();
    const { setCenter, getNodes } = useReactFlow();
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);

    const results = useMemo(() => {
        if (!query) return [];
        return familyData.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
    }, [familyData, query]);

    const handleSelect = (memberId: string) => {
        const nodes = getNodes();
        const node = nodes.find(n => n.id === memberId);

        if (node) {
            // Zoom to node
            const x = node.position.x + node.width! / 2; // Approximate center if width known, else default rect
            const y = node.position.y + node.height! / 2;

            setCenter(x, y, { zoom: 1.5, duration: 1000 });
            setSelectedMember(memberId);
            setQuery('');
            setFocused(false);
        }
    };

    return (
        <div className="relative z-10 w-full md:w-80">
            <div
                className={clsx(
                    "bg-white rounded-xl shadow-md border transition-all flex items-center px-3 py-3",
                    focused ? "border-primary ring-2 ring-primary/20" : "border-slate-200"
                )}
            >
                <Search size={20} className="text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search family member..."
                    className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)} // Delay for click handling
                />
                {query && (
                    <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 rounded-full">
                        <X size={16} className="text-slate-400" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {focused && query && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-80 overflow-y-auto"
                    >
                        {results.map(member => (
                            <button
                                key={member.id}
                                onClick={() => handleSelect(member.id)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0"
                            >
                                {member.avatar ? (
                                    <img src={member.avatar} className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{member.name}</p>
                                    <p className="text-xs text-slate-500">{member.birthDate}</p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
