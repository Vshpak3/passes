import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { MetricsService } from '../../monitoring/metrics/metric.service'
import { RequestWithUser } from '../../types/request'
import { createTokens } from '../../util/auth.util'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../auth/jwt/jwt-refresh.service'
import { S3ContentService } from '../s3content/s3content.service'
import { UserService } from '../user/user.service'
import {
  ImpersonateUserRequestDto,
  ImpersonateUserResponseDto,
} from './dto/impersonate-user.dto'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  private secret: string

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly s3contentService: S3ContentService,
    private readonly metrics: MetricsService,
  ) {
    this.secret = this.configService.get('admin.impersonate') as string
  }

  @ApiOperation({ summary: 'Impersonates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Access token for impersonated user',
  })
  @Post('impersonate')
  async impersonateUser(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() body: ImpersonateUserRequestDto,
  ): Promise<ImpersonateUserResponseDto> {
    this.metrics.increment('admin.impersonate')

    const reqUser = await this.userService.findOne(req.user.id)
    if (!reqUser.email.endsWith('@passes.com') || body.secret !== this.secret) {
      throw new BadRequestException('Invalid request')
    }

    const tokens = await createTokens(
      res,
      await this.userService.findOne(body.userId),
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
    return new ImpersonateUserResponseDto(tokens.accessToken)
  }
}
