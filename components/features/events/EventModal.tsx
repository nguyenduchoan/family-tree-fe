import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, Calendar, Save } from 'lucide-react';
import { Solar, Lunar } from 'lunar-javascript';
import { cn } from '@/lib/utils';
import { FamilyEvent } from '@/types';

export default function EventModal() {
    const { eventModal, closeEventModal, addEvent, events, deleteEvent } = useStore();
    const { isOpen, memberId } = eventModal;

    const [formData, setFormData] = useState<Partial<FamilyEvent>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        type: 'DEATH_ANNIVERSARY',
        calendarType: 'LUNAR', // Default for Vietnamese context
        isRecurring: true,
        reminderDays: 7
    });

    const isDeathAnniversary = formData.type === 'DEATH_ANNIVERSARY';

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberId || !formData.title || !formData.date) return;

        const newEvent: FamilyEvent = {
            id: crypto.randomUUID(),
            familyId: 'current', // Logic to get current family ID needed
            memberId,
            title: formData.title,
            date: formData.date,
            type: formData.type as any,
            calendarType: formData.calendarType as any,
            isRecurring: formData.isRecurring || false,
            reminderDays: formData.reminderDays || 7
        };

        addEvent(newEvent);
        closeEventModal();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="glass-card bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/40 backdrop-blur-md">
                    <h2 className={cn(
                        "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                        isDeathAnniversary ? "from-gray-700 to-gray-900" : "from-pink-500 to-purple-600"
                    )}>
                        {isDeathAnniversary ? 'Thêm Ngày Giỗ' : 'Thêm Sự Kiện'}
                    </h2>
                    <button onClick={closeEventModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Event Type Selection */}
                    <div className="flex p-1 bg-gray-100/50 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'DEATH_ANNIVERSARY', title: 'Ngày giỗ' })}
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                formData.type === 'DEATH_ANNIVERSARY' ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Ngày Giỗ
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'BIRTHDAY', title: 'Sinh nhật' })}
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                formData.type === 'BIRTHDAY' ? "bg-white shadow-sm text-pink-600" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Sinh Nhật
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'CUSTOM', title: '' })}
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                formData.type === 'CUSTOM' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Khác
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sự kiện</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ví dụ: Giỗ cụ tổ..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Loại Lịch</label>
                            <div className="flex gap-2 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.calendarType === 'LUNAR'}
                                        onChange={() => setFormData({ ...formData, calendarType: 'LUNAR' })}
                                        className="accent-purple-600 w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Âm lịch</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.calendarType === 'SOLAR'}
                                        onChange={() => setFormData({ ...formData, calendarType: 'SOLAR' })}
                                        className="accent-blue-600 w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Dương lịch</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Lunar Date Preview (If Lunar Selected) */}
                    {formData.calendarType === 'LUNAR' && formData.date && (
                        <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-purple-700 flex items-center gap-2">
                            <Calendar size={14} />
                            <span>
                                Lưu ý: Hệ thống sẽ tự động tính ngày giỗ theo Âm lịch hàng năm.
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700">Lặp lại hàng năm</span>
                        <input
                            type="checkbox"
                            checked={formData.isRecurring}
                            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                            className="w-5 h-5 accent-purple-600 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        Lưu Sự Kiện
                    </button>
                </form>
            </div>
        </div>
    );
}
