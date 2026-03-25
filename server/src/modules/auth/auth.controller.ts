import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 3600000, limit: 5 } })
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() request: Request) {
    return this.authService.register(dto, request);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 7 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    return this.authService.login(dto, response, request);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: RefreshDto
  ) {
    // Accept refresh token from body (preferred, always fresh) or cookie (fallback)
    const refreshToken = body?.refreshToken || request.cookies?.refresh_token;
    return this.authService.refreshSession(refreshToken, response);
  }

  @Public()
  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  @Post('password-reset/request')
  requestPasswordReset(@Body() dto: RequestPasswordResetDto, @Req() request: Request) {
    return this.authService.requestPasswordReset(dto, request);
  }

  @Public()
  @Throttle({ default: { ttl: 3600000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @Post('password-reset/confirm')
  confirmPasswordReset(
    @Body() dto: ConfirmPasswordResetDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    return this.authService.confirmPasswordReset(dto, response, request);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(user, response);
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user);
  }

  @Patch('password')
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    return this.authService.changePassword(user, dto, response, request);
  }
}
