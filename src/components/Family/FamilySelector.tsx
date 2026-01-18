import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Users } from 'lucide-react';

export const FamilySelector: React.FC = () => {
    const { fetchFamilies, createFamily, selectFamily, user } = useStore();
    const [families, setFamilies] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFamilyName, setNewFamilyName] = useState('');
    const [theme, setTheme] = useState<'modern' | 'traditional'>('traditional');

    useEffect(() => {
        loadFamilies();
    }, []);

    const loadFamilies = async () => {
        try {
            const data = await fetchFamilies();
            setFamilies(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFamilyName.trim()) return;

        try {
            await createFamily({ name: newFamilyName });
            setIsCreating(false);
            setNewFamilyName('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={`min-h-screen p-8 transition-all duration-500 bg-center ${theme === 'traditional'
            ? 'bg-[url("/bg-traditional-mobile-v2.png?v=3")] md:bg-[url("/bg-traditional-desktop-v2.png?v=3")] bg-[length:100%_100%] bg-no-repeat'
            : 'bg-gradient-to-br from-slate-50 to-emerald-50'
            }`}>
            {/* Overlay for Traditional Theme */}
            {theme === 'traditional' && (
                <div className="absolute inset-0 bg-yellow-900/10 pointer-events-none" />
            )}

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Content Grid */}
                <div className="mb-8">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-amber-100 max-w-lg mb-8">
                        <h1 className="text-3xl font-extrabold text-amber-900 mb-1 font-serif tracking-wide">
                            Gia Phả Dòng Tộc
                        </h1>
                        <p className="text-amber-700 font-medium">Xin chào, {user?.name}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100/90 backdrop-blur rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setTheme('traditional')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'traditional'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Truyền Thống
                            </button>
                            <button
                                onClick={() => setTheme('modern')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'modern'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Hiện Đại
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Create New Card */}
                    <div
                        onClick={() => setIsCreating(true)}
                        className={`
                            group rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[220px] border-2 border-dashed
                            ${theme === 'traditional'
                                ? 'bg-amber-50/80 border-amber-300/50 hover:bg-amber-100/90 hover:border-amber-400'
                                : 'bg-white/50 border-slate-300 hover:bg-white hover:border-emerald-400'
                            }
                        `}
                    >
                        <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm
                            ${theme === 'traditional' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-600'}
                        `}>
                            <Plus size={32} />
                        </div>
                        <span className={`font-bold text-lg ${theme === 'traditional' ? 'text-amber-800' : 'text-slate-700'}`}>
                            Tạo Gia Phả Mới
                        </span>
                        <span className={`text-sm mt-1 ${theme === 'traditional' ? 'text-amber-600/70' : 'text-slate-400'}`}>
                            Bắt đầu hành trình mới
                        </span>
                    </div>

                    {/* Family Cards */}
                    {families.map((family) => (
                        <div
                            key={family.id}
                            onClick={() => selectFamily(family)}
                            className={`
                                relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group
                                ${theme === 'traditional'
                                    ? 'bg-white/95 border border-amber-200/50 shadow-amber-900/10'
                                    : 'bg-white border border-slate-100 shadow-lg shadow-slate-200/50'
                                }
                            `}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <Users size={80} className={`${theme === 'traditional' ? 'text-amber-50' : 'text-slate-50'} -mr-4 -mt-4`} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl shadow-sm ${theme === 'traditional' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        <Users size={24} />
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${family.role === 'OWNER'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : 'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                        {family.role === 'OWNER' ? 'Quản Lý' : 'Thành Viên'}
                                    </span>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${theme === 'traditional' ? 'text-amber-900 font-serif' : 'text-slate-800'}`}>
                                    {family.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">
                                    {family.description || 'Chưa có mô tả dòng họ...'}
                                </p>
                                <div className="flex items-center text-xs font-medium text-slate-400 border-t border-slate-100 pt-4">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} /> {family.memberCount} thành viên
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>{new Date(family.createdAt).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal */}
                {isCreating && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Tạo Gia Phả Mới</h2>
                            <form onSubmit={handleCreate}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Tên Dòng Họ</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Gia tộc Nguyễn..."
                                        value={newFamilyName}
                                        onChange={(e) => setNewFamilyName(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                                    >
                                        Khởi Tạo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
