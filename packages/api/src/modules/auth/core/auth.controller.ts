import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { RequestWithUser } from '../../../types/request'
import { createTokens } from '../../../util/auth.util'
import { ApiEndpoint } from '../../../web/endpoint.web'
import { S3ContentService } from '../../s3content/s3content.service'
import { GetUserResponseDto } from '../../user/dto/get-user.dto'
import { UserService } from '../../user/user.service'
import { AccessTokensResponseDto } from '../dto/access-tokens-dto'
import { CreateUserRequestDto } from '../dto/create-user.dto'
import { RefreshAuthTokenRequestDto } from '../dto/refresh-auth-token.dto'
import { SetEmailRequestDto } from '../dto/set-email.dto'
import { VerifyEmailDto as VerifyEmailRequestDto } from '../dto/verify-email.dto'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshGuard } from '../jwt/jwt-refresh.guard'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { JwtUnverifiedGuard } from '../jwt/jwt-unverified.guard'
import { AuthService } from './auth.service'
import { AuthRecord } from './auth-record'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly userService: UserService,
    private readonly s3contentService: S3ContentService,
  ) {}

  /**
   * Can only be hit with an unverified access token.
   */
  @ApiEndpoint({
    summary: 'Sets the user email',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Sets the user email',
    allowUnauthorizedRequest: true,
  })
  @UseGuards(JwtUnverifiedGuard)
  @Post('set-email')
  async setUserEmail(
    @Req() req: RequestWithUser,
    @Body() body: SetEmailRequestDto,
  ): Promise<void> {
    await this.authService.setEmail(req.user.id, body.email)
  }

  /**
   * Can only be hit with an unverified access token.
   */
  @ApiEndpoint({
    summary: 'Verify email for the current user',
    responseStatus: HttpStatus.OK,
    responseType: AccessTokensResponseDto,
    responseDesc: 'A email was verified',
    allowUnauthorizedRequest: true,
  })
  @UseGuards(JwtUnverifiedGuard)
  @Post('verify-email')
  async verifyUserEmail(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    @Body() body: VerifyEmailRequestDto,
  ): Promise<AccessTokensResponseDto> {
    const authRecord = await this.authService.verifyEmailForUserSignin(
      req.user.id,
      body,
    )
    return await createTokens(
      res,
      authRecord,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
  }

  /**
   * Can only be hit with an unverified access token.
   */
  @ApiEndpoint({
    summary: 'Creates a new user',
    responseStatus: HttpStatus.CREATED,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Creates a new user',
    allowUnauthorizedRequest: true,
  })
  @UseGuards(JwtUnverifiedGuard)
  @Post('create-user')
  async createUser(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    @Body() body: CreateUserRequestDto,
  ): Promise<AccessTokensResponseDto> {
    const authRecord = await this.authService.createUser(req.user.id, body)
    return await createTokens(
      res,
      authRecord,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
  }

  /**
   * Can only be hit with VERIFIED access token.
   */
  @ApiEndpoint({
    summary: 'Gets the current authenticated user',
    responseStatus: HttpStatus.OK,
    responseType: GetUserResponseDto,
    responseDesc: 'Gets the current authenticated user',
  })
  @Get('user')
  async getCurrentUser(
    @Req() req: RequestWithUser,
  ): Promise<GetUserResponseDto> {
    return (await this.userService.findOne(req.user.id)) as GetUserResponseDto
  }

  /**
   * Can only be hit with a REFRESH token.
   */
  @ApiEndpoint({
    summary: 'Refresh the access token',
    responseStatus: HttpStatus.CREATED,
    responseType: AccessTokensResponseDto,
    responseDesc: 'Refresh token token was created',
    allowUnauthorizedRequest: true,
  })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshAccessToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    // Note: jwt-refresh.strategy extracts from body, need this DTO for generated api client.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: RefreshAuthTokenRequestDto,
  ): Promise<AccessTokensResponseDto> {
    const tokens = await createTokens(
      res,
      AuthRecord.fromUserDto(await this.userService.findOne(req.user.id)),
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
    return {
      accessToken: tokens.accessToken,
    }
  }
}
