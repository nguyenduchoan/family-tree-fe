"use client";

import { useEffect, Suspense } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';

function OAuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { checkAuth } = useStore();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Verify token and load user
            checkAuth().then(() => {
                const redirect = localStorage.getItem('auth_redirect');
                localStorage.removeItem('auth_redirect');
                router.push(redirect || '/');
            }).catch(() => {
                router.push('/login');
            });
        } else {
            // If no token, maybe check if error
            const error = searchParams.get('error');
            if (error) {
                console.error("OAuth Error:", error);
            }
            router.push('/login');
        }
    }, [searchParams, router, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Đang xử lý đăng nhập...</p>
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OAuthCallbackContent />
        </Suspense>
    );
}
