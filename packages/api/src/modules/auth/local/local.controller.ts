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

import { redirectAfterSuccessfulLogin } from '../../../util/auth.util'
import { AllowUnauthorizedRequest } from '../auth.metadata'
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

  @ApiOperation({ summary: 'Create a email and password user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a email and password user',
  })
  @AllowUnauthorizedRequest()
  @Post('/signup')
  async createEmailPasswordUser(
    @Body() createLocalUserDto: CreateLocalUserDto,
  ) {
    return this.localAuthService.createLocalUser(createLocalUserDto)
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login with email and password',
  })
  @AllowUnauthorizedRequest()
  @Post()
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

    return redirectAfterSuccessfulLogin.bind(this)(res, user)
  }
}
