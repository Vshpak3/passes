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
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { MetricsService } from '../../monitoring/metrics/metric.service'
import { RequestWithUser } from '../../types/request'
import { createTokens } from '../../util/auth.util'
import { ApiEndpoint } from '../../web/endpoint.web'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../auth/jwt/jwt-refresh.service'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
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

  @ApiEndpoint({
    summary: 'Impersonates a user',
    responseStatus: HttpStatus.OK,
    responseType: ImpersonateUserResponseDto,
    responseDesc: 'Access token for impersonated user',
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

    let impersonateUser: UserEntity
    if (body.userId) {
      impersonateUser = await this.userService.findOne(body.userId)
    } else if (body.username) {
      impersonateUser = await this.userService.findOneByUsername(body.username)
    } else {
      throw new BadRequestException('Must provide either a userId or username')
    }

    const tokens = await createTokens(
      res,
      impersonateUser,
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
    return new ImpersonateUserResponseDto(tokens.accessToken)
  }
}
