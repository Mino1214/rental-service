import { useAuthStore } from '../types/AuthStore';
import { AuthResponse, RefreshTokenResponse, User } from '../types/auth';

// API 베이스 URL (환경 변수에서 가져오거나 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API 에러 클래스
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// 요청 옵션 인터페이스
interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
}

// 기본 fetch 래퍼
async function fetchApi<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // 헤더 설정
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    // 인증 토큰 추가
    if (!skipAuth) {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        // 응답이 JSON이 아닌 경우 처리
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        let data: T;
        if (isJson) {
            data = await response.json();
        } else {
            data = (await response.text()) as unknown as T;
        }

        // 에러 처리
        if (!response.ok) {
            // 401 Unauthorized - 토큰 갱신 시도
            if (response.status === 401 && !skipAuth) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    // 토큰 갱신 성공 시 원래 요청 재시도
                    return fetchApi<T>(endpoint, options);
                } else {
                    // 토큰 갱신 실패 시 로그아웃
                    useAuthStore.getState().logout();
                    throw new ApiError('인증이 만료되었습니다. 다시 로그인해주세요.', 401);
                }
            }

            throw new ApiError(
                (data as { message?: string })?.message || '요청 처리 중 오류가 발생했습니다.',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
            0
        );
    }
}

// 토큰 갱신 시도
async function tryRefreshToken(): Promise<boolean> {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetchApi<RefreshTokenResponse>(
            '/auth/refresh',
            {
                method: 'POST',
                skipAuth: true,
                body: JSON.stringify({ refreshToken }),
            }
        );

        useAuthStore.getState().setTokens(response.accessToken, response.refreshToken);
        return true;
    } catch {
        return false;
    }
}

// API 메서드들
export const api = {
    // 인증 관련
    auth: {
        // OAuth 로그인 시작
        login: async (provider: 'google' | 'kakao' | 'naver'): Promise<{ redirectUrl: string }> => {
            return fetchApi<{ redirectUrl: string }>(`/auth/login/${provider}`, {
                method: 'POST',
                skipAuth: true,
            });
        },

        // OAuth 콜백 처리
        callback: async (
            provider: 'google' | 'kakao' | 'naver',
            code: string,
            state?: string
        ): Promise<AuthResponse> => {
            return fetchApi<AuthResponse>(`/auth/callback/${provider}`, {
                method: 'POST',
                skipAuth: true,
                body: JSON.stringify({ code, state }),
            });
        },

        // 로그아웃
        logout: async (): Promise<void> => {
            try {
                await fetchApi('/auth/logout', {
                    method: 'POST',
                });
            } finally {
                useAuthStore.getState().logout();
            }
        },

        // 현재 사용자 정보 가져오기
        getMe: async (): Promise<User> => {
            return fetchApi<User>('/auth/me');
        },

        // 토큰 갱신
        refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
            return fetchApi<RefreshTokenResponse>('/auth/refresh', {
                method: 'POST',
                skipAuth: true,
                body: JSON.stringify({ refreshToken }),
            });
        },
    },
};

export default api;

