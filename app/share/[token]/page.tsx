"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { familyApi } from "@/api/family";
import { useStore } from "@/store/useStore";
import { FamilyChart } from "@/components/features/family-tree/FamilyChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { MemberDetailPanel } from "@/components/features/family-tree/MemberDetailPanel";

export default function SharePage() {
    const params = useParams();
    const router = useRouter();
    const token = params?.token as string;
    const { loadPublicFamily, currentFamily, user, checkAuth } = useStore();
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleJoin = async () => {
        if (!token) return;
        setIsJoining(true);
        try {
            await familyApi.joinFamilyByShareToken(token);
            // toast.success("Đã tham gia gia phả thành công!"); // Need toast import if used
            router.push('/family-tree');
        } catch (error) {
            console.error("Join failed", error);
            // toast.error("Tham gia thất bại");
        } finally {
            setIsJoining(false);
        }
    };

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedFamily = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                // Fetch public data
                const data = await familyApi.getFamilyByShareToken(token);

                // Load into store
                loadPublicFamily(data.family, data.members);

            } catch (err: any) {
                console.error("Failed to load shared family", err);
                setError(err.response?.data?.message || "Liên kết không hợp lệ hoặc đã hết hạn.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSharedFamily();
    }, [token, loadPublicFamily]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-500 font-medium">Đang tải gia phả...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Không thể truy cập</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/">
                        <Button className="w-full">Về trang chủ</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Minimal Header for Share View */}
            <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
                <div className="mx-auto max-w-7xl flex items-center justify-between pointer-events-auto">
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-3">
                        <Link href="/" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold hover:bg-primary/90 transition-colors">
                            G
                        </Link>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-sm text-foreground">
                                Dòng họ {currentFamily?.name}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                Chế độ xem công khai
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <Button
                                onClick={handleJoin}
                                disabled={isJoining}
                                className="hidden sm:flex rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                            >
                                {isJoining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Tham gia Gia phả
                            </Button>
                        ) : (
                            <Link href={`/login?redirect=/share/${token}`}>
                                <Button variant="secondary" className="hidden sm:flex rounded-full shadow-sm">
                                    Đăng nhập để tham gia
                                </Button>
                            </Link>
                        )}

                        <Link href="/">
                            <Button variant="outline" size="sm" className="hidden sm:flex glass border-0 shadow-sm hover:bg-white/80">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Về trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full h-screen overflow-hidden relative">
                <div className="absolute inset-0 pt-0">
                    <FamilyChart onMemberClick={() => { }} />
                </div>

                {/* 
                   We include MemberDetailPanel but we might need to ensure its buttons (Edit/Add) 
                   are hidden if user is not logged in / owner. 
                   MemberDetailPanel usually relies on `store.selectedMemberId`.
                   Buttons inside it often check for permissions. 
                   We should check MemberDetailPanel implementation next to be sure.
                */}
                <MemberDetailPanel />
            </main>
        </div>
    );
}
