// OAuth 제공자 타입
export type OAuthProvider = 'google' | 'kakao' | 'naver';

// 사용자 정보 인터페이스
export interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    provider: OAuthProvider;
    createdAt: string;
    updatedAt: string;
}

// 인증 응답 인터페이스
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

// 로그인 요청 인터페이스
export interface LoginRequest {
    provider: OAuthProvider;
    code?: string;
    state?: string;
}

// 토큰 갱신 응답 인터페이스
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

