import { useState } from 'react';
import { TreeDeciduous, Settings, UserPlus, Share2, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import { useStore } from '../../store/useStore';
import MemberManagementModal from '../Family/MemberManagementModal';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export default function Header() {
    const currentFamily = useStore(state => state.currentFamily);
    const selectFamily = useStore(state => state.selectFamily);
    const logout = useStore(state => state.logout);
    const user = useStore(state => state.user);
    const openAddMemberModal = useStore(state => state.openAddMemberModal);

    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    const handleAddMemberClick = () => {
        if (!currentFamily) {
            alert("Vui lòng chọn một gia phả trước!");
            return;
        }
        openAddMemberModal();
    };

    return (
        <header className="h-16 glass sticky top-0 z-40 border-b border-white/20 px-4 md:px-6 flex items-center justify-between shadow-sm">
            {/* Left: Logo - Click to go Home */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => selectFamily(null)}
                title="Về trang chủ"
            >
                <div className="text-primary bg-primary/10 p-2 rounded-xl shadow-inner-sm">
                    <TreeDeciduous size={24} />
                </div>
                <div className="hidden md:block">
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">Gia Phả</h1>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Family Tree</p>
                </div>
            </motion.div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
                {currentFamily && <SearchBar />}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-3">
                {currentFamily ? (
                    <>
                        {currentFamily.role !== 'VIEWER' && (
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<UserPlus size={18} />}
                                onClick={handleAddMemberClick}
                                className="hidden md:flex shadow-emerald-500/20"
                            >
                                Thêm <span className="hidden lg:inline ml-1">Thành Viên</span>
                            </Button>
                        )}

                        <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-white/40">
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.8)" }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 transition-colors"
                                onClick={async () => {
                                    try {
                                        const token = await import('../../api/family').then(m => m.familyApi.createInvitation(currentFamily.id));
                                        const link = `${window.location.origin}/join?token=${token}`;
                                        await navigator.clipboard.writeText(link);
                                        import('react-hot-toast').then(m => m.toast.success('Đã sao chép link chia sẻ!'));
                                    } catch (e) {
                                        import('react-hot-toast').then(m => m.toast.error('Lỗi khi tạo link'));
                                    }
                                }}
                                title="Chia sẻ"
                            >
                                <Share2 size={18} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.8)" }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 transition-colors"
                                onClick={() => setIsMemberModalOpen(true)}
                                title="Cài đặt"
                            >
                                <Settings size={18} />
                            </motion.button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 hidden md:inline-block">Hoan chào, <b>{user?.name}</b></span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            rightIcon={<LogOut size={16} />}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        >
                            Đăng Xuất
                        </Button>
                    </div>
                )}
            </div>

            <MemberManagementModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} />
        </header>
    );
}
