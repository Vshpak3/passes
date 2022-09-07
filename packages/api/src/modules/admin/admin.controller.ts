import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { MetricsService } from '../../monitoring/metrics/metric.service'
import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { AdminService } from './admin.service'
import { AdminDto } from './dto/admin.dto'
import {
  ImpersonateUserRequestDto,
  ImpersonateUserResponseDto,
} from './dto/impersonate-user.dto'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly metrics: MetricsService,
  ) {}

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
    await this.adminService.adminCheck(req.user.id, body.secret)
    return await this.adminService.impersonateUser(
      res,
      body.userId,
      body.username,
    )
  }

  @ApiEndpoint({
    summary: 'Flags user as adult',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'User was marked as adult',
  })
  @Post('adult')
  async flagAsAdult(
    @Req() req: RequestWithUser,
    @Body() body: AdminDto,
  ): Promise<void> {
    await this.adminService.adminCheck(req.user.id, body.secret)
    await this.adminService.makeAdult(body.userId, body.username)
  }
}
