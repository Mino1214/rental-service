import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CallbackDto } from './dto/callback.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/:provider')
  @HttpCode(HttpStatus.OK)
  async login(@Param('provider') provider: 'google' | 'kakao' | 'naver') {
    return this.authService.getOAuthUrl(provider);
  }

  @Post('callback/:provider')
  @HttpCode(HttpStatus.OK)
  async callback(
    @Param('provider') provider: 'google' | 'kakao' | 'naver',
    @Body() callbackDto: CallbackDto,
  ) {
    return this.authService.handleOAuthCallback(provider, callbackDto.code, callbackDto.state);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.userId);
    return { message: '로그아웃되었습니다.' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}

