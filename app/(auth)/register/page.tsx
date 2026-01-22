"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const { register, isLoading, error } = useStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            router.push("/");
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="glass-card p-8 rounded-2xl shadow-xl border border-white/40">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-serif font-bold text-gray-800">Đăng Ký</h1>
                <p className="text-sm text-gray-500 mt-2">Tạo tài khoản để bắt đầu xây dựng gia phả</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Họ và Tên</label>
                    <Input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Đăng Ký"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
}
