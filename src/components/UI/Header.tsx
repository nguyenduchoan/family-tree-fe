import { useState } from 'react';
import { TreeDeciduous, Bell, Settings, UserPlus, Share2 } from 'lucide-react';
import SearchBar from './SearchBar';
import { useStore } from '../../store/useStore';
import MemberManagementModal from '../Family/MemberManagementModal';
// import AddMemberModal from '../Member/AddMemberModal'; // Moved to Global

export default function Header() {
    const { currentFamily, openAddMemberModal, selectFamily, logout } = useStore();
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    const handleAddMemberClick = () => {
        if (!currentFamily) {
            alert("Vui lòng chọn một gia phả trước!");
            return;
        }
        openAddMemberModal();
    };

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 relative z-30">
            {/* Left: Logo - Click to go Home */}
            <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => selectFamily(null)}
                title="Về trang chủ"
            >
                <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                    <TreeDeciduous size={24} />
                </div>
                <h1 className="text-lg font-bold text-slate-800 hidden md:block">Family Tree</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
                {currentFamily && <SearchBar />}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {currentFamily ? (
                    <>
                        {currentFamily.role !== 'VIEWER' && (
                            <button
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm active:scale-95 whitespace-nowrap"
                                onClick={handleAddMemberClick}
                            >
                                <UserPlus size={18} />
                                <span className="hidden md:inline">Thêm Thành Viên</span>
                            </button>
                        )}

                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            onClick={async () => {
                                try {
                                    const token = await import('../../api/family').then(m => m.familyApi.createInvitation(currentFamily.id));
                                    const link = `${window.location.origin}/join?token=${token}`;
                                    await navigator.clipboard.writeText(link);
                                    import('react-hot-toast').then(m => m.toast.success('Đã sao chép link chia sẻ vào clipboard!'));
                                } catch (e) {
                                    import('react-hot-toast').then(m => m.toast.error('Không thể tạo link chia sẻ'));
                                }
                            }}
                            title="Chia sẻ gia phả"
                        >
                            <Share2 size={20} />
                        </button>

                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            onClick={() => setIsMemberModalOpen(true)}
                            title="Quản lý thành viên"
                        >
                            <Settings size={20} />
                        </button>
                    </>
                ) : (
                    <button
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        onClick={logout}
                    >
                        Đăng Xuất
                    </button>
                )}

                {/* Notification Placeholder */}
                <button
                    className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                    onClick={() => alert("Tính năng thông báo sẽ sớm ra mắt!")}
                    title="Thông báo"
                >
                    <Bell size={20} />
                </button>
            </div>

            <MemberManagementModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} />
        </header>
    );
}
