import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const FamilySelector: React.FC = () => {
    const { fetchFamilies, createFamily, selectFamily, user } = useStore();
    const [families, setFamilies] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFamilyName, setNewFamilyName] = useState('');

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 md:p-12 relative">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-2">
                            Gia Phả Dòng Tộc
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Xin chào, <span className="font-semibold text-slate-800">{user?.name}</span>. Chọn gia phả để tiếp tục hành trình.
                        </p>
                    </motion.div>
                </div>

                {/* Content Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* Create New Card */}
                    <motion.div variants={item}>
                        <div
                            onClick={() => setIsCreating(true)}
                            className="h-full min-h-[220px] rounded-3xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white/30 hover:bg-white/60 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group p-8"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Plus size={32} className="text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">Tạo Gia Phả Mới</h3>
                            <p className="text-sm text-slate-400 mt-1">Bắt đầu một dòng tộc mới</p>
                        </div>
                    </motion.div>

                    {/* Family Cards */}
                    {families.map((family) => (
                        <Card
                            key={family.id}
                            variants={item}
                            className="h-full cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all duration-300 group relative overflow-hidden"
                            onClick={() => selectFamily(family)}
                            whileHover={{ y: -5 }}
                        >
                            {/* Decorative Gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <Users size={24} />
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${family.role === 'OWNER'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : 'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                        {family.role === 'OWNER' ? 'Quản Lý' : 'Thành Viên'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                    {family.name}
                                </h3>

                                <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-grow">
                                    {family.description || 'Chưa có mô tả dòng họ...'}
                                </p>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                                            ))}
                                        </div>
                                        <span className="ml-1">{family.memberCount} thành viên</span>
                                    </div>
                                    <span>{new Date(family.createdAt).getFullYear()}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>

                {/* Create Modal */}
                {isCreating && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Tạo Gia Phả Mới</h2>
                            <form onSubmit={handleCreate}>
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Tên Dòng Họ</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Gia tộc Nguyễn..."
                                        value={newFamilyName}
                                        onChange={(e) => setNewFamilyName(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!newFamilyName.trim()}
                                    >
                                        Khởi Tạo
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};
