"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FamilyChart } from "@/components/features/family-tree/FamilyChart";
import { MemberDetailPanel } from "@/components/features/family-tree/MemberDetailPanel";
import { useState, useEffect } from "react";
import { FamilyMember } from "@/types";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

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
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

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

    const handleMemberClick = (member: FamilyMember) => {
        setSelectedMember(member);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
    };

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
                </div>

                <div className="flex-1 border-t border-gray-200 bg-gray-50/50 relative overflow-hidden">
                    {/* Ensure container limits size for ReactFlow */}
                    {currentFamily ? (
                        <div className="absolute inset-0">
                            <FamilyChart onMemberClick={handleMemberClick} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400">Vui lòng chọn gia phả để xem...</div>
                        </div>
                    )}
                </div>
            </main>

            <MemberDetailPanel
                member={selectedMember}
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
            />

            <Footer />
        </div>
    );
}
