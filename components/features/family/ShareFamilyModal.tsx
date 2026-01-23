import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, Copy, Check, globe, Link as LinkIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface ShareFamilyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareFamilyModal({ isOpen, onClose }: ShareFamilyModalProps) {
    const { currentFamily, generateShareLink } = useStore();
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen || !currentFamily) return null;

    const handleGenerateLink = async () => {
        setIsLoading(true);
        try {
            const link = await generateShareLink(currentFamily.id);
            setShareLink(link);
        } catch (error) {
            // Error handling handled by store/api logs usually
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!shareLink) return;
        navigator.clipboard.writeText(shareLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Globe className="text-blue-500" size={20} />
                                Chia sẻ gia phả
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Tạo đường dẫn chia sẻ để mời người thân cùng xem cây gia phả.
                                Bất kỳ ai có đường dẫn này đều có thể xem (quyền Viewer).
                            </p>

                            {!shareLink ? (
                                <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                        <LinkIcon size={32} />
                                    </div>
                                    <Button
                                        onClick={handleGenerateLink}
                                        disabled={isLoading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                    >
                                        {isLoading ? 'Đang tạo...' : 'Tạo đường dẫn chia sẻ'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                        <input
                                            readOnly
                                            value={shareLink}
                                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-blue-600 shadow-sm"
                                            title="Sao chép"
                                        >
                                            {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-green-600 font-medium text-center bg-green-50 py-2 rounded-lg">
                                        Đường dẫn đã sẵn sàng để chia sẻ!
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
