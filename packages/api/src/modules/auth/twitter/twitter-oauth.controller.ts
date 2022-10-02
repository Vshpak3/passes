import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { redirectAfterOAuthLogin } from '../../../util/auth.util'
import { ApiEndpoint } from '../../../web/endpoint.web'
import { S3ContentService } from '../../s3content/s3content.service'
import { RoleEnum } from '../core/auth.role'
import { JwtService } from '../jwt/jwt.service'
import { TwitterOauthGuard } from './twitter-oauth.guard'

@Controller('auth/twitter')
@ApiTags('auth/twitter')
export class TwitterOauthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiEndpoint({
    summary: 'Start the twitter oauth flow',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Start the twitter oauth flow',
    role: RoleEnum.NO_AUTH_TRUE,
  })
  @UseGuards(TwitterOauthGuard)
  @Get()
  async twitterAuth() {
    // Guard redirects
  }

  @ApiEndpoint({
    summary: 'Redirect from twitter oauth flow',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Redirect from twitter oauth flow',
    role: RoleEnum.NO_AUTH_TRUE,
  })
  @ApiBearerAuth()
  @UseGuards(TwitterOauthGuard)
  @Get('redirect')
  async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return redirectAfterOAuthLogin.bind(this)(res, req.user)
  }
}
