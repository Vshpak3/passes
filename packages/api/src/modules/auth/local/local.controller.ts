import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { RequestWithUser } from '../../../types/request'
import { createTokens } from '../../../util/auth.util'
import { ApiEndpoint } from '../../../web/endpoint.web'
import { S3ContentService } from '../../s3content/s3content.service'
import { RoleEnum } from '../core/auth.role'
import { AccessTokensResponseDto } from '../dto/access-tokens.dto'
import { ConfirmResetPasswordRequestDto } from '../dto/local/confirm-reset-password.dto'
import { CreateLocalUserRequestDto } from '../dto/local/create-local-user.dto'
import { InitResetPasswordRequestDto } from '../dto/local/init-reset-password.dto'
import { LocalUserLoginRequestDto } from '../dto/local/local-user-login.dto'
import { UpdatePasswordRequestDto } from '../dto/local/update-password.dto'
import { JwtService } from '../jwt/jwt.service'
import { LocalAuthService } from './local.service'

@Controller('auth/local')
@ApiTags('auth/local')
export class LocalAuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly localAuthService: LocalAuthService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiEndpoint({
    summary: 'Create a email and password user',
    responseStatus: HttpStatus.CREATED,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Access tokens for new account',
    role: RoleEnum.NO_AUTH,
  })
  @Post('signup')
  async createEmailPasswordUser(
    @Body() createLocalUserDto: CreateLocalUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokensResponseDto> {
    const authRecord = await this.localAuthService.createLocalUser(
      createLocalUserDto,
    )
    return await createTokens(
      res,
      authRecord,
      this.jwtService,
      this.s3contentService,
    )
  }

  @ApiEndpoint({
    summary: 'Login with email and password',
    responseStatus: HttpStatus.OK,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Access tokens for login',
    role: RoleEnum.NO_AUTH_TRUE,
  })
  @Post('login')
  async loginWithEmailPassword(
    @Body() userLoginDto: LocalUserLoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokensResponseDto> {
    const authRecord = await this.localAuthService.validateLocalUser(
      userLoginDto,
    )
    return await createTokens(
      res,
      authRecord,
      this.jwtService,
      this.s3contentService,
    )
  }

  @ApiEndpoint({
    summary: 'Send reset password email to user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Sent email',
    role: RoleEnum.NO_AUTH,
  })
  @Post('init-reset-password')
  async initPasswordReset(
    @Body() initResetPasswordRequestDto: InitResetPasswordRequestDto,
  ) {
    await this.localAuthService.sendInitResetPasswordEmail(
      initResetPasswordRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Confirms reset password',
    responseStatus: HttpStatus.OK,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Access tokens for password reset',
    role: RoleEnum.NO_AUTH,
  })
  @Post('confirm-reset-password')
  async confirmPasswordReset(
    @Body() confirmResetPasswordRequestDto: ConfirmResetPasswordRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authRecord = await this.localAuthService.confirmResetPassword(
      confirmResetPasswordRequestDto,
    )
    return await createTokens(
      res,
      authRecord,
      this.jwtService,
      this.s3contentService,
    )
  }

  @ApiEndpoint({
    summary: 'Change password for current user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Change password for current user',
    role: RoleEnum.GENERAL,
  })
  @Post('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordRequestDto,
  ) {
    await this.localAuthService.updatePassword(req.user.id, updatePasswordDto)
  }
}
