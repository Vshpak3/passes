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

import { redirectAfterSuccessfulLogin } from '../../../util/auth.util'
import { S3Service } from '../../s3/s3.service'
import { UserEntity } from '../../user/entities/user.entity'
import { AllowUnauthorizedRequest } from '../auth.metadata'
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
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: 'Start the twitter oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start the twitter oauth flow',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(TwitterOauthGuard)
  @Get()
  async twitterAuth() {
    // Guard redirects
  }

  @ApiOperation({ summary: 'Redirect from twitter oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect from twitter oauth flow',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(TwitterOauthGuard)
  @Get('redirect')
  async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity
    return redirectAfterSuccessfulLogin.bind(this)(res, user)
  }
}
