import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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
                navigate(redirect || '/');
            }).catch(() => {
                navigate('/login');
            });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Đang xử lý đăng nhập...</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
