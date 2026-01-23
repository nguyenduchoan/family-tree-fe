"use client";

import { FamilyChart } from "@/components/features/family-tree/FamilyChart";
import { MemberDetailPanel } from "@/components/features/family-tree/MemberDetailPanel";
import AddMemberModal from "@/components/features/family/AddMemberModal";
import EditMemberModal from "@/components/features/family/EditMemberModal";
import { CreateFamilyModal } from "@/components/features/family/CreateFamilyModal";
import EventModal from "@/components/features/events/EventModal";
import FamilyCalendarModal from "@/components/features/calendar/FamilyCalendarModal";
import ShareFamilyModal from "@/components/features/family/ShareFamilyModal";
import FamilyMembersModal from "@/components/features/family/FamilyMembersModal";
import { useEffect, useState } from "react";
import { FamilyMember } from "@/types";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout/Header"; // Remove if unused later, but keeping for now if Auth logic is needed
// Actually, checkAuth is in Header? No, Header has user menu.
// We need to keep Auth logic. Maybe logic should be in a hook or we keep Header but hidden?
// The user said "remove header", implying visual removal.
// I will create a custom TopBar.

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Home, Share2, Settings, Calendar, Users, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function FamilyTreePage() {
    const {
        currentFamily,
        familyData,
        fetchMembers,
        fetchCurrentUserMemberId,
        selectFamily,
        fetchEvents,
        events
    } = useStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isMembersOpen, setIsMembersOpen] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (!currentFamily) {
                const storedFamilyId = localStorage.getItem('lastFamilyId');
                if (!storedFamilyId) {
                    // Optional: Check if user is logged in, if so fetch families and pick first? 
                    // For now redirect or wait.
                    // If we are on /family-tree we expect a family context.
                    // Let's assume without family ID we go home.
                    // But maybe checkAuth sets user first? 
                    // Let's just try to fetch the specific family if logic exists or fetch all.
                } else {
                    // Restore family
                    try {
                        // We need a method to get family by ID directly or ensure families are fetched.
                        // 'selectFamily' usually takes a family object. 
                        // 'fetchFamilies' returns list.
                        const families = await useStore.getState().fetchFamilies();
                        const found = families.find(f => f.id === storedFamilyId);
                        if (found) {
                            selectFamily(found);
                        } else {
                            // Family not found or access lost
                            localStorage.removeItem('lastFamilyId');
                            router.push('/');
                        }
                    } catch (e) {
                        console.error("Restoration failed", e);
                        setIsLoading(false); // Stop loading even if fail
                    }
                }
            } else {
                setIsLoading(false);
            }
        };
        init();
    }, [currentFamily, router, selectFamily]);

    // Data Loading Effect
    useEffect(() => {
        const loadData = async () => {
            if (currentFamily) {
                try {
                    if (familyData.length === 0) {
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

    // Event Fetching
    useEffect(() => {
        if (currentFamily) {
            fetchEvents(currentFamily.id);
        }
    }, [currentFamily, fetchEvents]);

    // Notification Logic
    useEffect(() => {
        if (events.length > 0) {
            // ... existing notification logic ...
        }
    }, [events]);


    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Custom Minimal Header */}
            <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-50 shadow-sm shrink-0">
                {/* Left: Branding & Family Name */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-200 transition-all">
                            <span className="font-serif font-bold text-xl">G</span>
                        </div>
                    </Link>

                    {currentFamily && (
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {currentFamily.name}
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                    {familyData.length} thành viên
                                </span>
                            </h1>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">
                                {currentFamily.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Actions Toolbar */}
                <div className="flex items-center gap-3">
                    {/* Home Button */}
                    <Link
                        href="/"
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Về trang chủ"
                    >
                        <Home size={20} />
                    </Link>

                    {/* Share Button */}
                    <button
                        className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                        title="Chia sẻ gia phả"
                        onClick={() => setIsShareOpen(true)}
                    >
                        <Share2 size={20} />
                    </button>

                    {/* Settings Dropdown */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-all outline-none">
                                <Settings size={18} />
                                <span className="text-sm">Cài đặt</span>
                                <ChevronDown size={14} className="opacity-50" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="min-w-[220px] bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 z-[100]"
                                sideOffset={5}
                                align="end"
                            >
                                <DropdownMenu.Item
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg cursor-pointer outline-none transition-colors"
                                    onClick={() => setIsCalendarOpen(true)}
                                >
                                    <Calendar size={16} />
                                    Lịch Gia Phả
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg cursor-pointer outline-none transition-colors"
                                    onClick={() => setIsMembersOpen(true)}
                                >
                                    <Users size={16} />
                                    Quản lý thành viên
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />

                                <DropdownMenu.Item
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors"
                                >
                                    <LogOut size={16} />
                                    Rời gia phả
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </header>

            {/* Main Content Area - Full Screen for Tree */}
            <main className="flex-1 relative overflow-hidden bg-dot-pattern">
                {currentFamily ? (
                    <>
                        <div className="absolute inset-0">
                            <FamilyChart onMemberClick={() => { }} />
                        </div>

                        {/* Modals & Panels */}
                        <AddMemberModal />
                        <EditMemberModal />
                        <CreateFamilyModal isOpen={false} onClose={() => { }} />
                        <EventModal />
                        <FamilyCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
                        <ShareFamilyModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
                        <FamilyMembersModal isOpen={isMembersOpen} onClose={() => setIsMembersOpen(false)} />
                        <MemberDetailPanel />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p>Đang tải dữ liệu gia phả...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
