import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../types/AuthStore';
import { OAuthProvider } from '../types/auth';

export default function CallbackPage() {
    const navigate = useNavigate();
    const { provider } = useParams<{ provider: OAuthProvider }>();
    const [searchParams] = useSearchParams();
    const { setAuth, setLoading, setError } = useAuthStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('로그인 처리 중...');

    useEffect(() => {
        const handleCallback = async () => {
            if (!provider) {
                setStatus('error');
                setMessage('잘못된 접근입니다.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            // 에러 처리
            if (error) {
                setStatus('error');
                setMessage('로그인에 실패했습니다. 다시 시도해주세요.');
                setError('OAuth 인증 오류가 발생했습니다.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            // 코드가 없는 경우
            if (!code) {
                setStatus('error');
                setMessage('인증 코드를 받지 못했습니다.');
                setError('인증 코드가 없습니다.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // 백엔드에 코드 전송하여 토큰 받기
                const authData = await api.auth.callback(provider, code, state || undefined);

                // 인증 정보 저장
                setAuth(authData);
                setStatus('success');
                setMessage('로그인 성공! 홈으로 이동합니다...');

                // 홈으로 리다이렉트
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            } catch (error) {
                setStatus('error');
                setMessage(
                    error instanceof Error
                        ? error.message
                        : '로그인 처리 중 오류가 발생했습니다.'
                );
                setError(
                    error instanceof Error
                        ? error.message
                        : '로그인 처리 중 오류가 발생했습니다.'
                );
                setTimeout(() => navigate('/login'), 3000);
            } finally {
                setLoading(false);
            }
        };

        handleCallback();
    }, [provider, searchParams, navigate, setAuth, setLoading, setError]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 border-4 border-pastel-orange-light border-t-pastel-orange rounded-full animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {message}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            잠시만 기다려주세요...
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <span className="text-3xl">✓</span>
                        </motion.div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {message}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            잠시 후 자동으로 이동합니다.
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <span className="text-3xl">✕</span>
                        </motion.div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {message}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">
                            로그인 페이지로 돌아갑니다.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-pastel-orange text-white rounded-full hover:bg-pastel-orange-dark transition-colors"
                        >
                            로그인 페이지로 이동
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
}

