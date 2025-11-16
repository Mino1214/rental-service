import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ComputerTower } from 'phosphor-react';
import { api } from '../utils/api';
import { useAuthStore } from '../types/AuthStore';
import { OAuthProvider } from '../types/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setLoading, setError, error } = useAuthStore();
    const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

    const handleLogin = async (provider: OAuthProvider) => {
        try {
            setLoadingProvider(provider);
            setLoading(true);
            setError(null);

            const { redirectUrl } = await api.auth.login(provider);
            // OAuth 제공자 페이지로 리다이렉트
            window.location.href = redirectUrl;
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : '로그인 중 오류가 발생했습니다.'
            );
            setLoadingProvider(null);
            setLoading(false);
        }
    };

    const oauthProviders: Array<{
        provider: OAuthProvider;
        name: string;
        color: string;
        bgColor: string;
        hoverColor: string;
        icon: string;
    }> = [
        {
            provider: 'google',
            name: 'Google',
            color: 'text-gray-700',
            bgColor: 'bg-white',
            hoverColor: 'hover:bg-gray-50',
            icon: '🔍',
        },
        {
            provider: 'kakao',
            name: '카카오',
            color: 'text-[#3C1E1E]',
            bgColor: 'bg-[#FEE500]',
            hoverColor: 'hover:bg-[#FDD835]',
            icon: '💬',
        },
        {
            provider: 'naver',
            name: '네이버',
            color: 'text-white',
            bgColor: 'bg-[#03C75A]',
            hoverColor: 'hover:bg-[#02B350]',
            icon: '🌐',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                    {/* 로고 및 제목 */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.6 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-pastel-orange rounded-2xl mb-6 shadow-lg"
                        >
                            <ComputerTower className="w-12 h-12 text-white" weight="fill" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            IT렌탈
                        </h1>
                        <p className="text-gray-600 text-base">
                            간편하게 로그인하고 시작하세요
                        </p>
                    </div>

                    {/* OAuth 로그인 버튼들 */}
                    <div className="space-y-3">
                        {oauthProviders.map((item) => (
                            <motion.button
                                key={item.provider}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => handleLogin(item.provider)}
                                disabled={loadingProvider !== null}
                                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${item.bgColor} ${item.color} ${item.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
                            >
                                {loadingProvider === item.provider ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        <span>로그인 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-2xl">{item.icon}</span>
                                        <span>{item.name}로 시작하기</span>
                                    </>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* 하단 안내 */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            로그인 시{' '}
                            <a href="#" className="text-primary-600 hover:text-primary-700 hover:underline font-medium">
                                이용약관
                            </a>
                            과{' '}
                            <a href="#" className="text-primary-600 hover:text-primary-700 hover:underline font-medium">
                                개인정보처리방침
                            </a>
                            에 동의하게 됩니다.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

