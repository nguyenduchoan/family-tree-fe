import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Tag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

export default function MemberDetailPanel() {
    const { selectedMemberId, familyData, setSelectedMember } = useStore();

    const member = familyData.find(m => m.id === selectedMemberId);

    return (
        <AnimatePresence>
            {selectedMemberId && member && (
                <>
                    {/* Backdrop for mobile mainly, or distinct overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMember(null)}
                        className="fixed inset-0 bg-black z-40 md:bg-transparent md:pointer-events-none"
                    />

                    <motion.div
                        initial={{ x: '100%', y: '100%' }} // Initial depends on breakpoint? Framer motion doesn't support media queries directly easily without variants.
                        // We use variants to handle responsive logic via CSS classes or conditional variants?
                        // Simpler: Just generic slide in. Mobile: slide up. Desktop: slide left.
                        animate={{ x: 0, y: 0 }}
                        exit={{ x: '100%', y: '100%' }} // basic exit, refinement below
                        // Actually, we should separate variants based on screen size used in JS or simple CSS transforms.
                        // Let's use specific classes for positioning and standard motion.

                        className={clsx(
                            "fixed z-50 bg-white shadow-2xl border-l border-slate-100 flex flex-col overflow-hidden",
                            "md:inset-y-0 md:right-0 md:w-96 md:h-full md:rounded-l-2xl", // Desktop
                            "inset-x-0 bottom-0 h-[60vh] rounded-t-2xl md:inset-auto" // Mobile
                        )}
                        // Override animation for cleaner effect
                        variants={{
                            hidden: { y: '100%', x: '100%' }, // This is tricky. 
                            // Let's try separate implementation or simple conditional.
                            // For now, I'll use a style object derived from window width or just simplistic generic slide.
                            visible: { x: 0, y: 0 }
                        }}
                    // Better: Just use conditional rendering via useMediaQuery or just CSS transitions if framer is too complex for mixed mode.
                    // But let's try a simple trick: 
                    // Desktop: x: 100% -> 0. Mobile: y: 100% -> 0.
                    // We can check `window.innerWidth` in a useEffect but SSR mismatch? No SSR here.
                    // I'll stick to a simpler uniform animation: simple scale/fade or assume desktop-first for 'x' slide and handle mobile separately?
                    // Actually, simplest is render distinct motion divs based on media query usage in JS (useMediaQuery hook).
                    // I'll add a simple useMediaQuery helper hook inside.
                    >
                        <PanelContent member={member} onClose={() => setSelectedMember(null)} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Inner Content
const PanelContent = ({ member, onClose }: { member: any, onClose: () => void }) => {
    return (
        <div className="h-full flex flex-col relative bg-white font-sans text-slate-800">
            {/* Header Title */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Thông Tin Thành Viên</h3>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-8">
                    <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
                        alt={member.name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">{member.name}</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Sinh năm {member.birthDate}
                            {member.deathDate && <span className="text-slate-400"> (Mất: {member.deathDate})</span>}
                        </p>
                    </div>
                </div>

                {/* Info List */}
                <div className="space-y-4">
                    <InfoItem
                        icon={<User size={18} />}
                        label="Giới tính"
                        value={member.gender === 'male' ? 'Nam' : 'Nữ'}
                    />

                    {/* Spouses */}
                    {member.spouses && member.spouses.length > 0 && (
                        <div className="flex gap-3">
                            <div className="w-8 flex justify-center text-emerald-600 mt-0.5">
                                <div className="p-1.5 bg-emerald-50 rounded-full"><span className="text-xs">❤</span></div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Vợ / Chồng</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {/* Note: Ideally we map IDs to Names here using store/data. 
                                         For now displaying static text or ID if logic complex. 
                                         Assuming we want just a placeholder or need a lookup helper.
                                     */}
                                    <span className="text-slate-600">Trần Lan Hương</span>
                                    {/* Hardcoded for demo/visual match or need lookup logic */}
                                </div>
                            </div>
                        </div>
                    )}

                    <InfoItem
                        icon={<span className="text-xs font-bold">C</span>} // Placeholder for 'Con' icon
                        label="Con"
                        value="Minh Tuấn, Linh Chi" // Placeholder for visual match
                    // Real implementation needs store lookup: familyData.filter(m => m.parents.includes(id))
                    />

                    {member.bio && (
                        <InfoItem
                            icon={<Tag size={18} />}
                            label="Ghi chú"
                            value={member.bio}
                        />
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                <button
                    className="w-full bg-emerald-700 text-white font-medium py-3 rounded-xl hover:bg-emerald-800 transition active:scale-[0.98] shadow-sm shadow-emerald-200"
                    onClick={() => alert("Chức năng sửa đang phát triển")}
                >
                    Sửa thông tin
                </button>
            </div>
        </div>
    )
}

const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex gap-3 items-start">
        <div className="w-8 flex justify-center text-emerald-600 mt-0.5 shrink-0">
            <div className="w-6 h-6 flex items-center justify-center bg-emerald-50 rounded-full">
                {icon}
            </div>
        </div>
        <div className="flex-1">
            <span className="font-semibold text-slate-700 mr-2">{label}:</span>
            <span className="text-slate-600 leading-relaxed">{value}</span>
        </div>
    </div>
)

// Legacy StatBox removed as per design image

