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

import { AllowUnauthorizedRequest } from '../auth.metadata'
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

  @ApiOperation({ summary: 'Start the google oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start the google oauth flow',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(GoogleOauthGuard)
  @Get()
  async googleAuth() {
    // Guard redirects
  }

  @ApiOperation({ summary: 'Redirect from google oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect from google oauth flow',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(GoogleOauthGuard)
  @Get('redirect')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity
    const accessToken = this.jwtAuthService.createAccessToken(user)
    const refreshToken = this.jwtRefreshService.createRefreshToken(user.id)

    return res.redirect(
      this.configService.get('clientUrl') +
        '/auth/success?accessToken=' +
        accessToken +
        '&refreshToken=' +
        refreshToken,
    )
  }
}
