import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Plus, Users, ArrowRight, ShieldCheck, Clock, Crown, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateFamilyModal } from './CreateFamilyModal';
import { Button } from '@/components/ui/button';

export const FamilySelector: React.FC = () => {
    const { fetchFamilies, selectFamily, user } = useStore();
    const router = useRouter();
    const [families, setFamilies] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadFamilies = async () => {
        setIsLoading(true);
        try {
            const data = await fetchFamilies();
            setFamilies(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFamilies();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] p-6 md:p-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1
                            className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2"
                        >
                            Gia Phả Của Bạn
                        </h1>
                        <p
                            className="text-slate-500 text-lg"
                        >
                            Chào mừng trở lại, <span className="font-semibold text-emerald-700">{user?.name}</span>.
                        </p>
                    </div>

                    {families.length > 0 && (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all"
                        >
                            <Plus size={20} />
                            <span>Tạo Gia Phả Mới</span>
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                            <p className="text-slate-400 mt-4 text-sm font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : families.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center max-w-2xl mx-auto">
                            <div className="relative mb-8 group">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-700" />
                                <div className="w-32 h-32 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 border border-emerald-100 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles size={48} className="text-emerald-500" />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12">
                                    Mới
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-800 mb-4">
                                Bạn chưa có gia phả nào
                            </h2>
                            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                                Hãy bắt đầu hành trình số hóa lịch sử dòng họ ngay hôm nay.
                                Tạo cây gia phả đầu tiên để lưu giữ và kết nối các thế hệ.
                            </p>

                            <button
                                onClick={() => setIsCreating(true)}
                                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all flex items-center gap-3"
                            >
                                <Plus size={24} strokeWidth={3} />
                                Bắt Đầu Ngay
                            </button>
                        </div>
                    ) : (
                        /* Grid Layout */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {families.map((family) => (
                                <div key={family.id}>
                                    <Card
                                        variant="default" // Using explicit solid variant
                                        className="h-full min-h-[240px] cursor-pointer hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 group relative flex flex-col justify-between border-slate-200 bg-white"
                                        onClick={async () => {
                                            await selectFamily(family);
                                            router.push('/family-tree');
                                        }}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-50 text-slate-100 pointer-events-none group-hover:text-emerald-50 group-hover:opacity-100 transition-colors duration-500">
                                            <Crown size={120} strokeWidth={0.5} className="-mr-8 -mt-8 rotate-12" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${family.role === 'OWNER'
                                                    ? 'bg-purple-100 border-purple-200 text-purple-600'
                                                    : 'bg-emerald-100 border-emerald-200 text-emerald-600'
                                                    }`}>
                                                    {family.role === 'OWNER' ? <ShieldCheck size={24} /> : <Users size={24} />}
                                                </div>
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${family.role === 'OWNER'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                    {family.role === 'OWNER' ? 'Quản Lý' : 'Thành Viên'}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
                                                {family.name}
                                            </h3>

                                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10">
                                                {family.description || 'Chưa có mô tả dòng họ...'}
                                            </p>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} />
                                                <span>{family.memberCount || 1} thành viên</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                                                <span>Xem chi tiết</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <CreateFamilyModal
                    isOpen={isCreating}
                    onClose={() => {
                        setIsCreating(false);
                        loadFamilies();
                    }}
                />
            </div>
        </div>
    );
};
