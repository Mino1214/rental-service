import { AuthService } from './auth.service';
import { CallbackDto } from './dto/callback.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(provider: 'google' | 'kakao' | 'naver'): Promise<{
        redirectUrl: string;
    }>;
    callback(provider: 'google' | 'kakao' | 'naver', callbackDto: CallbackDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        image: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken?: string;
    }>;
}
