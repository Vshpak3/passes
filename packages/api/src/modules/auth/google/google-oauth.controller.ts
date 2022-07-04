import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'

import { JwtAuthService } from '../jwt/jwt-auth.service'
import { UserEntity } from './../../user/entities/user.entity'
import { GoogleOauthGuard } from './google-oauth.guard'

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = this.jwtAuthService.login(req.user as UserEntity)
    res.cookie('session', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })
    return res.redirect('/api/auth/user')
  }
}
