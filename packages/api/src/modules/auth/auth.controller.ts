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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { RequestWithUser } from '../../types/request'
import { createTokens } from '../../util/auth.util'
import { S3ContentService } from '../s3content/s3content.service'
import { GetUserResponseDto } from '../user/dto/get-user.dto'
import { UserService } from '../user/user.service'
import { AllowUnauthorizedRequest } from './auth.metadata'
import { RefreshAuthTokenRequestDto } from './dto/refresh-auth-token'
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

  @ApiOperation({ summary: 'Gets the current authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserResponseDto,
    description: 'Gets the current authenticated user',
  })
  @Get('user')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return new GetUserResponseDto(
      await this.userService.findOne(req.user.id),
      true,
    )
  }

  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthTokenResponseDto,
    description: 'Refresh token token was created',
  })
  @AllowUnauthorizedRequest()
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
}
