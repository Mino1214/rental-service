import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../types/AuthStore';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const location = useLocation();

    // 로딩 중일 때는 아무것도 표시하지 않음 (또는 로딩 스피너 표시 가능)
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    // 인증이 필요한 페이지인데 로그인하지 않은 경우
    if (requireAuth && !isAuthenticated) {
        // 로그인 후 원래 페이지로 돌아올 수 있도록 현재 위치 저장
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 인증이 필요 없는 페이지인데 로그인한 경우 (예: 로그인 페이지)
    if (!requireAuth && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

