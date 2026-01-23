"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FamilyChart } from "@/components/features/family-tree/FamilyChart";
import { MemberDetailPanel } from "@/components/features/family-tree/MemberDetailPanel";
import AddMemberModal from "@/components/features/family/AddMemberModal";
import EditMemberModal from "@/components/features/family/EditMemberModal";
import { CreateFamilyModal } from "@/components/features/family/CreateFamilyModal";
import EventModal from "@/components/features/events/EventModal";
import FamilyCalendarModal from "@/components/features/calendar/FamilyCalendarModal";
import { useEffect, useState } from "react";
import { FamilyMember } from "@/types";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon } from 'lucide-react';

export default function FamilyTreePage() {
    const {
        currentFamily,
        familyData,
        fetchMembers,
        fetchCurrentUserMemberId,
        selectFamily
    } = useStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (!currentFamily) {
                // If no family selected (and not restored yet), maybe redirect or wait?
                // checkAuth in Header should handle restoration.
                // We can wait a bit or check localStorage directly if checkAuth is slow?
                const storedFamilyId = localStorage.getItem('lastFamilyId');
                if (!storedFamilyId) {
                    router.push('/');
                    return;
                }
                // If storedFamilyId exists, checkAuth will eventually set currentFamily.
                // We'll rely on the effect below.
            }
        };
        init();
    }, [currentFamily, router]);

    useEffect(() => {
        const loadData = async () => {
            if (currentFamily) {
                try {
                    if (familyData.length === 0) {
                        console.log("Fetching members for family:", currentFamily.id);
                        await fetchMembers(currentFamily.id);
                    }
                    await fetchCurrentUserMemberId(currentFamily.id);
                } catch (error) {
                    console.error("Failed to load family data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadData();
    }, [currentFamily, fetchMembers, fetchCurrentUserMemberId, familyData.length]);

    // Check for upcoming events
    const { fetchEvents, events } = useStore();
    useEffect(() => {
        if (currentFamily) {
            fetchEvents(currentFamily.id);
        }
    }, [currentFamily, fetchEvents]);

    useEffect(() => {
        if (events.length > 0) {
            const today = new Date();
            const upcoming = events.filter(e => {
                const eventDate = new Date(e.date);
                const diffTime = eventDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 3; // Notify for events in next 3 days
            });

            if (upcoming.length > 0) {
                // Simple mock notification for now
                console.log("Upcoming events:", upcoming);
            }
        }
    }, [events]);


    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 pt-24 pb-12 overflow-hidden flex flex-col">
                <div className="container mx-auto px-4 mb-8">
                    <h1 className="text-3xl font-serif font-bold text-foreground">
                        {currentFamily ? `Dòng họ ${currentFamily.name}` : 'Đang tải gia phả...'}
                    </h1>
                    <p className="text-gray-500">
                        {currentFamily?.description || '...'}
                    </p>
                    <div className="mt-4">
                        <button
                            onClick={() => setIsCalendarOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-700"
                        >
                            <CalendarIcon size={18} className="text-purple-600" />
                            Lịch Gia Phả
                        </button>
                    </div>
                </div>

                <div className="flex-1 border-t border-gray-200 bg-gray-50/50 relative overflow-hidden">
                    {/* Ensure container limits size for ReactFlow */}
                    {currentFamily ? (
                        <>
                            <div className="absolute inset-0">
                                <FamilyChart onMemberClick={() => { }} />
                            </div>
                            <AddMemberModal />
                            <EditMemberModal />
                            <CreateFamilyModal isOpen={false} onClose={() => { }} />
                            <EventModal />
                            <FamilyCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
                            <MemberDetailPanel />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400">Vui lòng chọn gia phả để xem...</div>
                        </div>
                    )}
                </div>
            </main >

            <Footer />
        </div >
    );
}
