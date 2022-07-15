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
import { FacebookOauthGuard } from './facebook-oauth.guard'

@Controller('auth/facebook')
@ApiTags('auth/facebook')
export class FacebookOauthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Start the facebook oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start the facebook oauth flow',
  })
  @UseGuards(FacebookOauthGuard)
  async facebookAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @ApiOperation({ summary: 'Redirect from facebook oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect from facebook oauth flow',
  })
  @UseGuards(FacebookOauthGuard)
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = this.jwtAuthService.login(req.user as UserEntity)
    return res.redirect(
      this.configService.get('clientUrl') +
        '/auth/success?accessToken=' +
        accessToken,
    )
  }
}
