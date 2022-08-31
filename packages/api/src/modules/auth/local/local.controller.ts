import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { S3ContentService } from '../../s3content/s3content.service'
import { AllowUnauthorizedRequest } from '../auth.metadata'
import { CreateLocalUserRequestDto } from '../dto/create-local-user'
import { LocalUserLoginRequestDto } from '../dto/local-user-login'
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
    private readonly configService: ConfigService,
    private readonly localAuthService: LocalAuthService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiOperation({ summary: 'Create a email and password user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthTokenResponseDto,
    description: 'Create a email and password user',
  })
  @AllowUnauthorizedRequest()
  @Post('/signup')
  async createEmailPasswordUser(
    @Body() createLocalUserDto: CreateLocalUserRequestDto,
    @Res() res: Response,
  ) {
    const user = await this.localAuthService.createLocalUser(createLocalUserDto)

    const accessToken = this.jwtAuthService.createAccessToken(user)
    const refreshToken = this.jwtRefreshService.createRefreshToken(user.id)
    await this.s3contentService.signCookies(res, `*/${user.id}`)

    res.status(201).send({ accessToken, refreshToken })
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

    const accessToken = this.jwtAuthService.createAccessToken(user)
    const refreshToken = this.jwtRefreshService.createRefreshToken(user.id)
    await this.s3contentService.signCookies(res, `*/${user.id}`)

    res.status(200).send({ accessToken, refreshToken })
  }
}
