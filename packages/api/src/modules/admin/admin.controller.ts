import {
  Body,
  Controller,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { MetricsService } from '../../monitoring/metrics/metric.service'
import { ApiEndpoint } from '../../web/endpoint.web'
import { AdminService } from './admin.service'
import { AddExternalPassAddressRequestDto } from './dto/add-external-pass-addres.dto'
import { AdminDto } from './dto/admin.dto'
import { CreateExternalPassRequestDto } from './dto/create-external-pass.dto'
import { DeleteExternalPassAddressRequestDto } from './dto/delete-external-pass-address.to'
import {
  GetCreatorFeeRequestDto,
  GetCreatorFeeResponseDto,
} from './dto/get-creator-fee.dto'
import {
  ImpersonateUserRequestDto,
  ImpersonateUserResponseDto,
} from './dto/impersonate-user.dto'
import { SetCreatorFeeRequestDto } from './dto/set-creator-fee.dto'
import { UpdateExternalPassRequestDto } from './dto/update-external-pass.dto'

/**
 * All admin endpoints are protected via this guard. It is set on the Admin
 * controller and will always be called after the main JWT authentication:
 *   https://docs.nestjs.com/faq/request-lifecycle#summary
 */
@Injectable()
class AdminGuard extends AuthGuard('jwt') {
  constructor(private readonly adminService: AdminService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // No need to call super, jwt auth is handled by global auth
    const req = context.switchToHttp().getRequest()
    await this.adminService.adminCheck(req.user.id, req.body['secret'])
    return true
  }
}

@UseGuards(AdminGuard)
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
    @Res({ passthrough: true }) res: Response,
    @Body() body: ImpersonateUserRequestDto,
  ): Promise<ImpersonateUserResponseDto> {
    this.metrics.increment('admin.impersonate')
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
  async flagAsAdult(@Body() body: AdminDto): Promise<void> {
    await this.adminService.makeAdult(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Add external pass',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'External pass was added',
  })
  @Post('external-pass/add')
  async addExternalPass(
    @Body() body: CreateExternalPassRequestDto,
  ): Promise<boolean> {
    return await this.adminService.addExternalPass(body)
  }

  @ApiEndpoint({
    summary: 'Update external pass',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'External pass was updated',
  })
  @Post('external-pass/add')
  async updateExternalPass(
    @Body() body: UpdateExternalPassRequestDto,
  ): Promise<boolean> {
    return await this.adminService.updateExternalPass(body)
  }

  @ApiEndpoint({
    summary: 'Delete external pass',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'External pass was deleted',
  })
  @Post('external-pass/delete')
  async deleteExternalPass(
    @Body() body: UpdateExternalPassRequestDto,
  ): Promise<boolean> {
    return await this.adminService.deleteExternalPass(body.passId)
  }

  @ApiEndpoint({
    summary: 'Add external pass address',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'External pass was added',
  })
  @Post('external-pass/address/add')
  async addExternalPassAddress(
    @Body() body: AddExternalPassAddressRequestDto,
  ): Promise<boolean> {
    return await this.adminService.addExternalPassAddress(body)
  }

  @ApiEndpoint({
    summary: 'Delete external pass address',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'External pass was deleted',
  })
  @Post('external-pass/address/delete')
  async deleteExternalPassAddress(
    @Body() body: DeleteExternalPassAddressRequestDto,
  ): Promise<boolean> {
    return await this.adminService.deleteExternalPassAddress(body)
  }

  @ApiEndpoint({
    summary: 'Set creator fee',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'Creator fee was set',
  })
  @Post('creator-fee/set')
  async setCreatorFee(@Body() body: SetCreatorFeeRequestDto): Promise<boolean> {
    return await this.adminService.setCreatorFee(body)
  }

  @ApiEndpoint({
    summary: 'Get creator fee',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorFeeResponseDto,
    responseDesc: 'Creator fee was received',
  })
  @Post('creator-fee/get')
  async getCreatorFee(
    @Body() body: GetCreatorFeeRequestDto,
  ): Promise<GetCreatorFeeResponseDto> {
    return await this.adminService.getCreatorFee(body)
  }
}
