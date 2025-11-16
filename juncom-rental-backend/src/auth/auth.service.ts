import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import axios from 'axios';

type OAuthProvider = 'google' | 'kakao' | 'naver';

interface OAuthUserInfo {
  id: string;
  email: string;
  name: string;
  image?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getOAuthUrl(provider: OAuthProvider): Promise<{ redirectUrl: string }> {
    const state = crypto.randomBytes(32).toString('hex');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    let redirectUrl: string;

    switch (provider) {
      case 'google':
        const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const googleRedirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
        if (!googleClientId || !googleRedirectUri) {
          throw new BadRequestException('Google OAuth 설정이 완료되지 않았습니다.');
        }
        redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(googleRedirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`;
        break;

      case 'kakao':
        const kakaoClientId = this.configService.get<string>('KAKAO_CLIENT_ID');
        const kakaoRedirectUri = this.configService.get<string>('KAKAO_REDIRECT_URI');
        if (!kakaoClientId || !kakaoRedirectUri) {
          throw new BadRequestException('Kakao OAuth 설정이 완료되지 않았습니다.');
        }
        redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(kakaoRedirectUri)}&response_type=code&state=${state}`;
        break;

      case 'naver':
        const naverClientId = this.configService.get<string>('NAVER_CLIENT_ID');
        const naverRedirectUri = this.configService.get<string>('NAVER_REDIRECT_URI');
        if (!naverClientId || !naverRedirectUri) {
          throw new BadRequestException('Naver OAuth 설정이 완료되지 않았습니다.');
        }
        redirectUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${encodeURIComponent(naverRedirectUri)}&state=${state}`;
        break;

      default:
        throw new BadRequestException('지원하지 않는 OAuth 제공자입니다.');
    }

    return { redirectUrl };
  }

  async handleOAuthCallback(
    provider: OAuthProvider,
    code: string,
    state?: string,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    let userInfo: OAuthUserInfo;

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
        throw new BadRequestException('지원하지 않는 OAuth 제공자입니다.');
    }

    // 사용자 찾기 또는 생성
    let user = await this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId: userInfo.id,
        },
      },
    });

    if (!user) {
      // 이메일로 기존 사용자 확인
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (existingUser) {
        throw new BadRequestException('이미 다른 방법으로 가입된 이메일입니다.');
      }

      // 새 사용자 생성
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          image: userInfo.image,
          provider,
          providerId: userInfo.id,
        },
      });
    } else {
      // 사용자 정보 업데이트
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name,
          image: userInfo.image || user.image,
        },
      });
    }

    // 토큰 생성
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider as OAuthProvider,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
    };
  }

  private async handleGoogleCallback(code: string): Promise<OAuthUserInfo> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');

    // 토큰 교환
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // 사용자 정보 가져오기
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
      id: userResponse.data.id,
      email: userResponse.data.email,
      name: userResponse.data.name,
      image: userResponse.data.picture,
    };
  }

  private async handleKakaoCallback(code: string): Promise<OAuthUserInfo> {
    const clientId = this.configService.get<string>('KAKAO_CLIENT_ID');
    const clientSecret = this.configService.get<string>('KAKAO_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('KAKAO_REDIRECT_URI');

    // 토큰 교환
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
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

    // 사용자 정보 가져오기
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
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

  private async handleNaverCallback(code: string, state?: string): Promise<OAuthUserInfo> {
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('NAVER_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('NAVER_REDIRECT_URI');

    // 토큰 교환
    const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
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

    // 사용자 정보 가져오기
    const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
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

  private generateAccessToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '15m';
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn as any,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 기본 7일

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const newAccessToken = this.generateAccessToken(tokenRecord.userId, tokenRecord.user.email);

    // 리프레시 토큰 갱신 (선택적)
    let newRefreshToken: string | undefined;
    if (tokenRecord.expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
      // 만료 24시간 전이면 새 리프레시 토큰 발급
      await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      newRefreshToken = await this.generateRefreshToken(tokenRecord.userId);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
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
}

