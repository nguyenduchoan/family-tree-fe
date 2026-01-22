import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { X, Trees } from 'lucide-react';

interface CreateFamilyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateFamilyModal: React.FC<CreateFamilyModalProps> = ({ isOpen, onClose }) => {
    const { createFamily } = useStore();
    const [newFamilyName, setNewFamilyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFamilyName.trim()) return;

        setIsLoading(true);
        try {
            await createFamily({ name: newFamilyName });
            setNewFamilyName('');
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="glass-card bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-32 bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <Trees className="text-white/20 w-48 h-48 absolute -bottom-12 -right-12 rotate-[-15deg] blur-sm" />

                            <div className="text-center z-10 relative">
                                <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">Khởi Tạo Dòng Họ</h2>
                                <p className="text-blue-100 text-sm font-medium tracking-wide">Bắt đầu hành trình kết nối thế hệ</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleCreate}>
                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                        Tên Dòng Họ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Ví dụ: Đại gia đình Nguyễn Văn..."
                                            value={newFamilyName}
                                            onChange={(e) => setNewFamilyName(e.target.value)}
                                            className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 text-lg font-medium group-hover:bg-white"
                                            autoFocus
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 ml-1">
                                        Tên này sẽ hiển thị trên cây gia phả của bạn. Bạn có thể đổi sau.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl px-6"
                                    >
                                        Hủy Bỏ
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!newFamilyName.trim() || isLoading}
                                        className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-2 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                                    >
                                        {isLoading ? 'Đang tạo...' : 'Tạo Mới'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
