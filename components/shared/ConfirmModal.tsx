import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    variant = 'danger',
    isLoading = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const getVariantColors = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-200',
                    border: 'border-red-100'
                };
            case 'warning':
                return {
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200',
                    border: 'border-yellow-100'
                };
            default:
                return {
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
                    border: 'border-blue-100'
                };
        }
    };

    const colors = getVariantColors();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <div className={`glass-card bg-white/95 backdrop-blur-xl border ${colors.border} rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
                <div className="p-6">
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}>
                            <AlertTriangle className={colors.iconColor} size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2 ${colors.confirmBtn}`}
                    >
                        {isLoading ? 'Đang xử lý...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
