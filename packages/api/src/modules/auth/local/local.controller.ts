import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { createTokens } from '../../../util/auth.util'
import { EmailService } from '../../email/email.service'
import { S3ContentService } from '../../s3content/s3content.service'
import { AllowUnauthorizedRequest } from '../auth.metadata'
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

  @ApiOperation({ summary: 'Create a email and password user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthTokenResponseDto,
    description: 'Create a email and password user',
  })
  @AllowUnauthorizedRequest()
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

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthTokenResponseDto,
    description: 'Login with email and password',
  })
  @AllowUnauthorizedRequest()
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

  @ApiOperation({ summary: 'Send reset password email to user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Send reset password email to user',
  })
  @AllowUnauthorizedRequest()
  @Post()
  async initPasswordReset(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    await this.emailService.sendInitResetPassword(resetPasswordDto.email)
  }
}
