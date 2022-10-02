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
import { GoogleOauthGuard } from './google-oauth.guard'

@Controller('auth/google')
@ApiTags('auth/google')
export class GoogleOauthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiEndpoint({
    summary: 'Start the google oauth flow',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Start the google oauth flow',
    role: RoleEnum.NO_AUTH_TRUE,
  })
  @UseGuards(GoogleOauthGuard)
  @Get()
  async googleAuth() {
    // Guard redirects
  }

  @ApiEndpoint({
    summary: 'Redirect from google oauth flow',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Redirect from google oauth flow',
    role: RoleEnum.NO_AUTH_TRUE,
  })
  @ApiBearerAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('redirect')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return redirectAfterOAuthLogin.bind(this)(res, req.user)
  }
}
