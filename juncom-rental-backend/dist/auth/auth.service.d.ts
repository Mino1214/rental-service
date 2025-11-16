import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
type OAuthProvider = 'google' | 'kakao' | 'naver';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    getOAuthUrl(provider: OAuthProvider): Promise<{
        redirectUrl: string;
    }>;
    handleOAuthCallback(provider: OAuthProvider, code: string, state?: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    private handleGoogleCallback;
    private handleKakaoCallback;
    private handleNaverCallback;
    private generateAccessToken;
    private generateRefreshToken;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken?: string;
    }>;
    logout(userId: string): Promise<void>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        image: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
    }>;
}
export {};
