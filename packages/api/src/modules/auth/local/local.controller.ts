import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { createTokens } from '../../../util/auth.util'
import { ApiEndpoint } from '../../../web/endpoint.web'
import { EmailService } from '../../email/email.service'
import { S3ContentService } from '../../s3content/s3content.service'
import { CreateLocalUserRequestDto } from '../dto/create-local-user'
import { LocalUserLoginRequestDto } from '../dto/local-user-login'
import { ResetPasswordRequestDto } from '../dto/reset-password'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { AuthTokenResponseDto } from './auth-token.dto'
import { LocalAuthService } from './local.service'

@Controller('auth/local')
@ApiTags('auth/local')
export class LocalAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly localAuthService: LocalAuthService,
    private readonly s3contentService: S3ContentService,
    private readonly emailService: EmailService,
  ) {}

  @ApiEndpoint({
    summary: 'Create a email and password user',
    responseStatus: HttpStatus.CREATED,
    responseType: AuthTokenResponseDto,
    responseDesc: 'Create a email and password user',
    allowUnauthorizedRequest: true,
  })
  @Post('signup')
  async createEmailPasswordUser(
    @Body() createLocalUserDto: CreateLocalUserRequestDto,
    @Res() res: Response,
  ) {
    const user = await this.localAuthService.createLocalUser(createLocalUserDto)

    const tokens = await createTokens(
      res,
      user,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )

    res.status(HttpStatus.CREATED).send(tokens)
  }

  @ApiEndpoint({
    summary: 'Login with email and password',
    responseStatus: HttpStatus.OK,
    responseType: AuthTokenResponseDto,
    responseDesc: 'Login with email and password',
    allowUnauthorizedRequest: true,
  })
  @Post()
  async loginWithEmailPassword(
    @Body() loginDto: LocalUserLoginRequestDto,
    @Res() res: Response,
  ) {
    const user = await this.localAuthService.validateLocalUser(
      loginDto.email,
      loginDto.password,
    )

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const tokens = await createTokens(
      res,
      user,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )

    res.status(HttpStatus.OK).send(tokens)
  }

  @ApiEndpoint({
    summary: 'Send reset password email to user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Send reset password email to user',
    allowUnauthorizedRequest: true,
  })
  @Post()
  async initPasswordReset(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    await this.emailService.sendInitResetPassword(resetPasswordDto.email)
  }
}
