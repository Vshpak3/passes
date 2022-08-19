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
import { S3Service } from '../s3/s3.service'
import { GetUserDto } from '../user/dto/get-user.dto'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { AllowUnauthorizedRequest } from './auth.metadata'
import { RefreshAuthTokenDto } from './dto/refresh-auth-token'
import { JwtAuthService } from './jwt/jwt-auth.service'
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard'
import { JwtRefreshService } from './jwt/jwt-refresh.service'
import { AuthTokenDto } from './local/auth-token.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: 'Gets the current authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserDto,
    description: 'Gets the current authenticated user',
  })
  @Get('user')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return new GetUserDto(await this.userService.findOne(req.user.id), true)
  }

  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthTokenDto,
    description: 'Access token was created',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshAccessToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    // Note: jwt-refresh.strategy extracts from body, need this DTO for generated api client.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: RefreshAuthTokenDto,
  ) {
    await this.s3Service.signCookies(res, `*/${req.user.id}`)
    return {
      accessToken: this.jwtAuthService.createAccessToken(
        req.user as UserEntity,
      ),
    }
  }
}
