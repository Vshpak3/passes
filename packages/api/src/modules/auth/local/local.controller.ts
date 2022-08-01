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

import { CreateLocalUserDto } from '../dto/create-local-user'
import { LocalUserLoginDto } from '../dto/local-user-login'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { LocalAuthService } from './local.service'

@Controller('auth/local')
@ApiTags('auth/local')
export class LocalAuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly configService: ConfigService,
    private readonly localAuthService: LocalAuthService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create a email and password user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a email and password user',
  })
  async createEmailPasswordUser(
    @Body() createLocalUserDto: CreateLocalUserDto,
  ) {
    return this.localAuthService.createLocalUser(createLocalUserDto)
  }

  @Post('')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login with email and password',
  })
  async loginWithEmailPassword(
    @Body() loginDto: LocalUserLoginDto,
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

    return res.redirect(
      this.configService.get('clientUrl') +
        '/auth/success?accessToken=' +
        accessToken +
        '&refreshToken=' +
        refreshToken,
    )
  }
}
