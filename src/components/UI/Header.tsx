import { TreeDeciduous, Bell, Settings, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 relative z-30">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                    <TreeDeciduous size={24} />
                </div>
                <h1 className="text-lg font-bold text-slate-800 hidden md:block">Family Tree</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
                <SearchBar />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm active:scale-95 whitespace-nowrap"
                    onClick={() => alert("Chức năng thêm sẽ sớm ra mắt!")}
                >
                    <UserPlus size={18} />
                    <span className="hidden md:inline">Thêm Thành Viên</span>
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                    <Bell size={20} />
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}
