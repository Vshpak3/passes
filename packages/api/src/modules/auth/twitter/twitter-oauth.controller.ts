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

import { UserEntity } from '../../user/entities/user.entity'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { TwitterOauthGuard } from './twitter-oauth.guard'

@Controller('auth/twitter')
@ApiTags('auth/twitter')
export class TwitterOauthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Start the twitter oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start the twitter oauth flow',
  })
  @UseGuards(TwitterOauthGuard)
  async twitterAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @ApiOperation({ summary: 'Redirect from twitter oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect from twitter oauth flow',
  })
  @UseGuards(TwitterOauthGuard)
  async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
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
