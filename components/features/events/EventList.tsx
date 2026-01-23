import { FamilyEvent } from '@/types';
import { cn } from '@/lib/utils';
import { Bell, Edit2, Calendar, Trash2 } from 'lucide-react';
import { Solar, Lunar } from 'lunar-javascript';

interface EventListProps {
    events: FamilyEvent[];
    onEdit: (event: FamilyEvent) => void;
    onDelete: (eventId: string) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Calendar size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Chưa có sự kiện nào</p>
            </div>
        );
    }

    const calculateDaysRemaining = (event: FamilyEvent) => {
        const today = new Date();
        const eventDate = new Date(event.date);

        // For recurring events, we need logical calculation (Lunar/Solar)
        // Simplified Logic for Demo: Just diff logic to be improved
        // If Lunar, we need conversion.

        return Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    };

    return (
        <div className="space-y-3">
            {events.map((event) => (
                <div key={event.id} className="glass-card p-3 rounded-xl flex justify-between items-center group hover:bg-white/60 transition-all border border-purple-100/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "w-2 h-2 rounded-full",
                                event.type === 'DEATH_ANNIVERSARY' ? "bg-gray-800" : "bg-pink-500"
                            )} />
                            <h4 className="font-bold text-gray-800 text-sm">{event.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar size={10} />
                            {event.date} ({event.calendarType === 'LUNAR' ? 'Âm lịch' : 'Dương lịch'})
                        </p>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(event)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(event.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
