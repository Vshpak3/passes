import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { RequestWithUser } from '../../../types/request'
import { createTokens } from '../../../util/auth.util'
import { ApiEndpoint } from '../../../web/endpoint.web'
import { S3ContentService } from '../../s3content/s3content.service'
import { AccessTokensResponseDto } from '../dto/access-tokens-dto'
import { CreateLocalUserRequestDto } from '../dto/local/create-local-user.dto'
import { LocalUserLoginRequestDto } from '../dto/local/local-user-login.dto'
import { ResetPasswordRequestDto } from '../dto/local/reset-password.dto'
import { UpdatePasswordRequestDto } from '../dto/local/update-password.dto'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { LocalAuthService } from './local.service'

@Controller('auth/local')
@ApiTags('auth/local')
export class LocalAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly localAuthService: LocalAuthService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiEndpoint({
    summary: 'Create a email and password user',
    responseStatus: HttpStatus.CREATED,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Create a email and password user',
    allowUnauthorizedRequest: true,
  })
  @Post('signup')
  async createEmailPasswordUser(
    @Body() createLocalUserDto: CreateLocalUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokensResponseDto> {
    const authRecord = await this.localAuthService.createLocalUser(
      createLocalUserDto.email,
      createLocalUserDto.password,
    )

    return await createTokens(
      res,
      authRecord,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
  }

  @ApiEndpoint({
    summary: 'Login with email and password',
    responseStatus: HttpStatus.OK,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Login with email and password',
    allowUnauthorizedRequest: true,
  })
  @Post('login')
  async loginWithEmailPassword(
    @Body() loginDto: LocalUserLoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokensResponseDto> {
    const authRecord = await this.localAuthService.validateLocalUser(
      loginDto.email,
      loginDto.password,
    )
    return await createTokens(
      res,
      authRecord,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
  }

  @ApiEndpoint({
    summary: 'Send reset password email to user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Send reset password email to user',
    allowUnauthorizedRequest: true,
  })
  @Post('reset-password')
  async initPasswordReset(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    await this.localAuthService.sendInitResetPassword(resetPasswordDto.email)
  }

  @ApiEndpoint({
    summary: 'Change password for current user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Change password for current user',
  })
  @Post('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordRequestDto,
  ) {
    await this.localAuthService.updatePassword(
      req.user.id,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    )
  }
}
