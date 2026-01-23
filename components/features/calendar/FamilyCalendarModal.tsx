import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Solar, Lunar } from 'lunar-javascript';
import { cn } from '@/lib/utils';
import { FamilyEvent } from '@/types';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function FamilyCalendarModal({ isOpen, onClose }: CalendarModalProps) {
    const { events, openEventModal } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Generate Calendar Grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const days = [];

        // Previous month filler
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const solar = Solar.fromDate(date);
            const lunar = solar.getLunar();

            days.push({
                date,
                day: i,
                lunarDay: lunar.getDay(),
                lunarMonth: lunar.getMonth(),
                lunarYear: lunar.getYear(),
                fullLunar: lunar.toFullString(),
                events: [] as FamilyEvent[]
            });
        }

        return days;
    }, [year, month]);

    // Map Events to Days
    const daysWithEvents = useMemo(() => {
        return calendarDays.map(day => {
            if (!day) return null;

            // Filter events for this day
            const dayEvents = events.filter(event => {
                // TODO: Robust Date Logic Here (Recurrence, Lunar vs Solar)
                // Simplified mock logic: String match for Solar, needs Lunar conversion logic

                if (event.calendarType === 'SOLAR') {
                    // Check MM-DD match for recurring?
                    // Or exact ISO match? 
                    // Let's assume exact ISO match for single, MM-DD for recurring
                    return event.date === day.date.toISOString().split('T')[0]
                        || (event.isRecurring && event.date.endsWith(`-${String(day.day).padStart(2, '0')}`)); // FIX: Need MM match too
                } else {
                    // Lunar Check
                    // event.date string needs to be parsed as lunar date? 
                    // Assume event.date is YYYY-MM-DD format of the LUNAR date or Solar date of origin?
                    // IF we stored LUNAR date as string, we parse it:
                    const [eY, eM, eD] = event.date.split('-').map(Number);
                    // Check if current day's LUNAR date matches
                    return eD === day.lunarDay && eM === day.lunarMonth;
                }
            });

            return { ...day, events: dayEvents };
        });
    }, [calendarDays, events]);


    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <div className="glass-card bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-800">Tháng {month + 1}, {year}</h2>
                            <button onClick={goToToday} className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                                Hôm nay
                            </button>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => openEventModal()} // No memberId = Global Event
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Sự Kiện Chung
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/50 rounded-full transition-all">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50/30">
                    {/* Weekdays */}
                    <div className="grid grid-cols-7 mb-4">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="text-center text-sm font-bold text-gray-400 uppercase tracking-wider py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {daysWithEvents.map((day, index) => {
                            if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

                            const isToday = day.date.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={day.date.toISOString()}
                                    className={cn(
                                        "aspect-square bg-white border border-gray-100 rounded-2xl p-2 relative group hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden",
                                        isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""
                                    )}
                                >
                                    {/* Date Header */}
                                    <div className="flex justify-between items-start">
                                        <span className={cn(
                                            "text-lg font-bold leading-none",
                                            isToday ? "text-blue-600" : "text-gray-700"
                                        )}>{day.day}</span>

                                        {/* Lunar Date */}
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-medium text-gray-400">
                                                {day.lunarDay}/{day.lunarMonth}
                                            </span>
                                            {day.lunarDay === 1 && (
                                                <span className="text-[8px] text-pink-500 font-bold">Mùng 1</span>
                                            )}
                                            {day.lunarDay === 15 && (
                                                <span className="text-[8px] text-purple-500 font-bold">Rằm</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Events Dots/List */}
                                    <div className="flex flex-col gap-1 mt-1 overflow-y-auto scrollbar-none">
                                        {day.events.map((event, idx) => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    "text-[10px] truncate px-1.5 py-0.5 rounded-md font-medium",
                                                    event.type === 'DEATH_ANNIVERSARY' ? "bg-gray-100 text-gray-700" :
                                                        event.type === 'BIRTHDAY' ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
                                                )}
                                                title={event.title}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Hover Add Button */}
                                    {/* <button className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Plus className="text-gray-500 bg-white rounded-full p-1 shadow-sm" />
                                    </button> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
