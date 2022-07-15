import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { UserEntity } from './../../user/entities/user.entity'
import { GoogleOauthGuard } from './google-oauth.guard'

@Controller('auth/google')
@ApiTags('auth/google')
export class GoogleOauthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Start the google oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start the google oauth flow',
  })
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @ApiOperation({ summary: 'Redirect from google oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect from google oauth flow',
  })
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const userId = (req.user as UserEntity)?.id
    const accessToken = this.jwtAuthService.createAccessToken(userId)
    const refreshToken = this.jwtRefreshService.createRefreshToken(userId)

    return res.redirect(
      this.configService.get('clientUrl') +
        '/auth/success?accessToken=' +
        accessToken +
        '&refreshToken=' +
        refreshToken,
    )
  }
}
