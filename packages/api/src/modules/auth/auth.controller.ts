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

import { RequestWithUser } from '../../types/request'
import { createTokens } from '../../util/auth.util'
import { ApiEndpoint } from '../../web/endpoint.web'
import { S3ContentService } from '../s3content/s3content.service'
import { GetUserResponseDto } from '../user/dto/get-user.dto'
import { UserService } from '../user/user.service'
import { RefreshAuthTokenRequestDto } from './dto/refresh-auth-token'
import { SetEmailRequestDto } from './dto/set-email'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { JwtAuthService } from './jwt/jwt-auth.service'
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard'
import { JwtRefreshService } from './jwt/jwt-refresh.service'
import { AuthTokenResponseDto } from './local/auth-token.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly userService: UserService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiEndpoint({
    summary: 'Gets the current authenticated user',
    responseStatus: HttpStatus.OK,
    responseType: GetUserResponseDto,
    responseDesc: 'Gets the current authenticated user',
  })
  @Get('user')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return (await this.userService.findOne(req.user.id)) as GetUserResponseDto
  }

  @ApiEndpoint({
    summary: 'Refresh the access token',
    responseStatus: HttpStatus.CREATED,
    responseType: AuthTokenResponseDto,
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
  ) {
    const tokens = await createTokens(
      res,
      await this.userService.findOne(req.user.id),
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
    return {
      accessToken: tokens.accessToken,
    }
  }

  @ApiEndpoint({
    summary: 'Sets the user email',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Sets the user email',
  })
  @UseGuards(JwtAuthGuard)
  @Post('set-email')
  async setUserEmail(
    @Req() req: RequestWithUser,
    @Body() body: SetEmailRequestDto,
  ) {
    await this.userService.setEmail(req.user.id, body.email)
  }
}
