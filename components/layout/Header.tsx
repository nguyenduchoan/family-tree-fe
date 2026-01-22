"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Copy, Plus, Menu, User, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
    const { user, checkAuth, logout } = useStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="mx-auto max-w-7xl glass rounded-full px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold">
                        G
                    </div>
                    <span className="font-serif font-bold text-xl text-foreground tracking-tight">Gia Phả</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                    <Link href="/family-tree" className="hover:text-primary transition-colors">Cây gia phả</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Thư viện</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Giới thiệu</Link>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary overflow-hidden border border-blue-200">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-xs">{user.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-red-50 hover:text-red-500">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="hidden sm:flex">Đăng nhập</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="rounded-full bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                                    Đăng ký
                                </Button>
                            </Link>
                        </>
                    )}

                    <button className="md:hidden p-2 text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
