"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login, isLoading, error } = useStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            router.push("/"); // Redirect to home/dashboard
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="glass-card p-8 rounded-2xl shadow-xl border border-white/40">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-serif font-bold text-gray-800">Đăng Nhập</h1>
                <p className="text-sm text-gray-500 mt-2">Chào mừng trở lại với Gia Phả Số</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <Input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Mật khẩu</label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Link href="#" className="text-xs text-primary hover:underline">Quên mật khẩu?</Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/50 backdrop-blur px-2 text-gray-500 rounded-full">Hoặc tiếp tục với</span>
                </div>
            </div>

            <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:9001'}/oauth2/authorization/google`}
                className="w-full flex items-center justify-center gap-2 border border-white/40 bg-white/40 backdrop-blur-sm text-gray-700 py-2.5 rounded-lg hover:bg-white/60 transition-colors shadow-sm"
                onClick={() => {
                    const from = "/";
                    if (from && from !== '/') {
                        localStorage.setItem('auth_redirect', from);
                    }
                }}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span className="font-medium">Google</span>
            </a>

            <div className="mt-6 text-center text-sm text-gray-500">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                    Đăng ký ngay
                </Link>
            </div>
        </div>
    );
}
