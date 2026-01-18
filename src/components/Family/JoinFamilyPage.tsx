import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { familyApi } from '../../api/family';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function JoinFamilyPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { selectFamily, fetchFamilies, user } = useStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMsg('Link tham gia không hợp lệ.');
            return;
        }

        const join = async () => {
            try {
                // If user not logged in, they should satisfy ProtectedRoute first?
                // Or we handle redirect to login? 
                // Currently this component will be potentially public or protected?
                // Let's assume ProtectedRoute wraps it or we redirect.

                // If verify user logic is outside, we proceed.
                const family = await familyApi.joinFamily(token);
                await fetchFamilies();
                await selectFamily(family);
                toast.success(`Đã tham gia gia phả "${family.name}" thành công!`);
                setStatus('success');

                // Redirect after delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } catch (error: any) {
                console.error("Join failed", error);
                setStatus('error');
                setErrorMsg(error.response?.data?.message || 'Không thể tham gia gia phả. Link có thể đã hết hạn.');
            }
        };

        if (user) {
            join();
        } else {
            // Wait for user to be loaded or redirect?
            // If checking auth...
            // Ideally this page is inside ProtectedRoute
        }

    }, [token, user, navigate, selectFamily, fetchFamilies]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={48} className="animate-spin text-emerald-600" />
                        <h2 className="text-xl font-bold text-slate-700">Đang tham gia gia phả...</h2>
                        <p className="text-slate-500">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-emerald-700">Thành công!</h2>
                        <p className="text-slate-500">Đang chuyển hướng đến cây phả hệ...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <XCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-red-700">Có lỗi xảy ra</h2>
                        <p className="text-slate-600">{errorMsg}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                        >
                            Về trang chủ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
