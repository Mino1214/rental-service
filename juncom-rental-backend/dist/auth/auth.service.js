"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async getOAuthUrl(provider) {
        const state = crypto.randomBytes(32).toString('hex');
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        let redirectUrl;
        switch (provider) {
            case 'google':
                const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
                const googleRedirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
                if (!googleClientId || !googleRedirectUri) {
                    throw new common_1.BadRequestException('Google OAuth 설정이 완료되지 않았습니다.');
                }
                redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(googleRedirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`;
                break;
            case 'kakao':
                const kakaoClientId = this.configService.get('KAKAO_CLIENT_ID');
                const kakaoRedirectUri = this.configService.get('KAKAO_REDIRECT_URI');
                if (!kakaoClientId || !kakaoRedirectUri) {
                    throw new common_1.BadRequestException('Kakao OAuth 설정이 완료되지 않았습니다.');
                }
                redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(kakaoRedirectUri)}&response_type=code&state=${state}`;
                break;
            case 'naver':
                const naverClientId = this.configService.get('NAVER_CLIENT_ID');
                const naverRedirectUri = this.configService.get('NAVER_REDIRECT_URI');
                if (!naverClientId || !naverRedirectUri) {
                    throw new common_1.BadRequestException('Naver OAuth 설정이 완료되지 않았습니다.');
                }
                redirectUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${encodeURIComponent(naverRedirectUri)}&state=${state}`;
                break;
            default:
                throw new common_1.BadRequestException('지원하지 않는 OAuth 제공자입니다.');
        }
        return { redirectUrl };
    }
    async handleOAuthCallback(provider, code, state) {
        let userInfo;
        switch (provider) {
            case 'google':
                userInfo = await this.handleGoogleCallback(code);
                break;
            case 'kakao':
                userInfo = await this.handleKakaoCallback(code);
                break;
            case 'naver':
                userInfo = await this.handleNaverCallback(code, state);
                break;
            default:
                throw new common_1.BadRequestException('지원하지 않는 OAuth 제공자입니다.');
        }
        let user = await this.prisma.user.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId: userInfo.id,
                },
            },
        });
        if (!user) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: userInfo.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('이미 다른 방법으로 가입된 이메일입니다.');
            }
            user = await this.prisma.user.create({
                data: {
                    email: userInfo.email,
                    name: userInfo.name,
                    image: userInfo.image,
                    provider,
                    providerId: userInfo.id,
                },
            });
        }
        else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    name: userInfo.name,
                    image: userInfo.image || user.image,
                },
            });
        }
        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = await this.generateRefreshToken(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                provider: user.provider,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
            accessToken,
            refreshToken,
        };
    }
    async handleGoogleCallback(code) {
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
        const tokenResponse = await axios_1.default.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });
        const { access_token } = tokenResponse.data;
        const userResponse = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        return {
            id: userResponse.data.id,
            email: userResponse.data.email,
            name: userResponse.data.name,
            image: userResponse.data.picture,
        };
    }
    async handleKakaoCallback(code) {
        const clientId = this.configService.get('KAKAO_CLIENT_ID');
        const clientSecret = this.configService.get('KAKAO_CLIENT_SECRET');
        const redirectUri = this.configService.get('KAKAO_REDIRECT_URI');
        const tokenResponse = await axios_1.default.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { access_token } = tokenResponse.data;
        const userResponse = await axios_1.default.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const kakaoAccount = userResponse.data.kakao_account;
        return {
            id: userResponse.data.id.toString(),
            email: kakaoAccount.email,
            name: kakaoAccount.profile?.nickname || kakaoAccount.name || '카카오 사용자',
            image: kakaoAccount.profile?.profile_image_url,
        };
    }
    async handleNaverCallback(code, state) {
        const clientId = this.configService.get('NAVER_CLIENT_ID');
        const clientSecret = this.configService.get('NAVER_CLIENT_SECRET');
        const redirectUri = this.configService.get('NAVER_REDIRECT_URI');
        const tokenResponse = await axios_1.default.post('https://nid.naver.com/oauth2.0/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code,
                state,
            },
        });
        const { access_token } = tokenResponse.data;
        const userResponse = await axios_1.default.get('https://openapi.naver.com/v1/nid/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const response = userResponse.data.response;
        return {
            id: response.id,
            email: response.email,
            name: response.name || response.nickname || '네이버 사용자',
            image: response.profile_image,
        };
    }
    generateAccessToken(userId, email) {
        const payload = { sub: userId, email };
        const expiresIn = this.configService.get('JWT_EXPIRES_IN') || '15m';
        return this.jwtService.sign(payload, {
            expiresIn: expiresIn,
        });
    }
    async generateRefreshToken(userId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
        return token;
    }
    async refreshAccessToken(refreshToken) {
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }
        const newAccessToken = this.generateAccessToken(tokenRecord.userId, tokenRecord.user.email);
        let newRefreshToken;
        if (tokenRecord.expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
            await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
            newRefreshToken = await this.generateRefreshToken(tokenRecord.userId);
        }
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(userId) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            provider: user.provider,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map