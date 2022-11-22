import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { MetricsService } from '../../monitoring/metrics/metric.service'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { GetAgencyMembersResponseDto } from '../agency/dto/get-agency-members.dto'
import { RoleEnum } from '../auth/core/auth.role'
import { AccessTokensResponseDto } from '../auth/dto/access-tokens.dto'
import { JwtGeneralGuard } from '../auth/jwt/general/jwt-general.guard'
import { CreatePassResponseDto } from '../pass/dto/create-pass.dto'
import { GetChargebacksResponseDto } from '../payment/dto/get-chargebacks.dto'
import { AdminGuard } from './admin.guard'
import { AdminService } from './admin.service'
import { AddExternalPassAddressRequestDto } from './dto/add-external-pass-addres.dto'
import { AdminDto } from './dto/admin.dto'
import { CreateExternalPassRequestDto } from './dto/create-external-pass.dto'
import { CreateManualPassRequestDto } from './dto/create-manual-pass.dto'
import { DeleteExternalPassAddressRequestDto } from './dto/delete-external-pass-address.to'
import {
  GetCreatorFeeRequestDto,
  GetCreatorFeeResponseDto,
} from './dto/get-creator-fee.dto'
import { ImpersonateUserRequestDto } from './dto/impersonate-user.dto'
import { SetCreatorFeeRequestDto } from './dto/set-creator-fee.dto'
import { UpdateAgencyMemberDto } from './dto/update-agency-member.dto'
import { UpdateChargebackRequestDto } from './dto/update-chargeback.dto'
import { UpdateExternalPassRequestDto } from './dto/update-external-pass.dto'
import { UserExternalPassRequestDto } from './dto/user-external-pass.dto'

@UseGuards(JwtGeneralGuard, AdminGuard)
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
    responseType: AccessTokensResponseDto,
    responseDesc: 'Access token for impersonated user',
    role: RoleEnum.NO_AUTH,
  })
  @Post('impersonate')
  async impersonateUser(
    @Res({ passthrough: true }) res: Response,
    @Body() body: ImpersonateUserRequestDto,
  ): Promise<AccessTokensResponseDto> {
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
    role: RoleEnum.NO_AUTH,
  })
  @Post('adult')
  async flagAsAdult(@Body() body: AdminDto): Promise<void> {
    await this.adminService.makeAdult(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Set user up as a creator',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'User was set up as a creator',
    role: RoleEnum.NO_AUTH,
  })
  @Post('creator')
  async setupCreator(@Body() body: AdminDto): Promise<void> {
    await this.adminService.makeCreator(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Make creator public',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Creator was made public',
    role: RoleEnum.NO_AUTH,
  })
  @Post('public')
  async markPublic(@Body() body: AdminDto): Promise<void> {
    await this.adminService.markPublic(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Make creator private',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Creator was made private',
    role: RoleEnum.NO_AUTH,
  })
  @Post('private')
  async removePublic(@Body() body: AdminDto): Promise<void> {
    await this.adminService.removePublic(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Make creator suggested',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Creator was made suggested',
    role: RoleEnum.NO_AUTH,
  })
  @Post('suggested')
  async markSuggested(@Body() body: AdminDto): Promise<void> {
    await this.adminService.markSuggested(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Make creator unsuggetsed',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Creator was made unsuggested',
    role: RoleEnum.NO_AUTH,
  })
  @Post('unsuggested')
  async removeSuggested(@Body() body: AdminDto): Promise<void> {
    await this.adminService.removeSuggested(body.userId, body.username)
  }

  @ApiEndpoint({
    summary: 'Add external pass',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass was added',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/add')
  async addExternalPass(
    @Body() body: CreateExternalPassRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(await this.adminService.addExternalPass(body))
  }

  @ApiEndpoint({
    summary: 'Update external pass',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass was updated',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/update')
  async updateExternalPass(
    @Body() body: UpdateExternalPassRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.adminService.updateExternalPass(body),
    )
  }

  @ApiEndpoint({
    summary: 'Delete external pass',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass was deleted',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/delete')
  async deleteExternalPass(
    @Body() body: UpdateExternalPassRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.adminService.deleteExternalPass(body.passId),
    )
  }

  @ApiEndpoint({
    summary: 'Add external pass address',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass was added',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/address/add')
  async addExternalPassAddress(
    @Body() body: AddExternalPassAddressRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.adminService.addExternalPassAddress(body),
    )
  }

  @ApiEndpoint({
    summary: 'Delete external pass address',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass was deleted',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/address/delete')
  async deleteExternalPassAddress(
    @Body() body: DeleteExternalPassAddressRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.adminService.deleteExternalPassAddress(body),
    )
  }

  @ApiEndpoint({
    summary: 'Add external pass for user',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass for user was added',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/user/add')
  async addUserExternalPass(
    @Body() body: UserExternalPassRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.adminService.addUserExternalPass(body),
    )
  }

  @ApiEndpoint({
    summary: 'Delete external pass for user',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'External pass for user deleted',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external-pass/user/delete')
  async deleteUserExternalPass(
    @Body() body: UserExternalPassRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.adminService.deleteUserExternalPass(body),
    )
  }

  @ApiEndpoint({
    summary: 'Set creator fee',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Creator fee was set',
    role: RoleEnum.NO_AUTH,
  })
  @Post('creator-fee/set')
  async setCreatorFee(
    @Body() body: SetCreatorFeeRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(await this.adminService.setCreatorFee(body))
  }

  @ApiEndpoint({
    summary: 'Get creator fee',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorFeeResponseDto,
    responseDesc: 'Creator fee was received',
    role: RoleEnum.NO_AUTH,
  })
  @Post('creator-fee/get')
  async getCreatorFee(
    @Body() body: GetCreatorFeeRequestDto,
  ): Promise<GetCreatorFeeResponseDto> {
    return await this.adminService.getCreatorFee(body)
  }

  @ApiEndpoint({
    summary: 'Get unprocessed chargebacks',
    responseStatus: HttpStatus.OK,
    responseType: GetChargebacksResponseDto,
    responseDesc: 'Unprocessed chargebacks were retrieved',
    role: RoleEnum.NO_AUTH,
  })
  @Post('chargeback/unprocessed')
  async getUnprocessChargebacks(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: AdminDto,
  ): Promise<GetChargebacksResponseDto> {
    return new GetChargebacksResponseDto(
      await this.adminService.getChargebacks(),
    )
  }

  @ApiEndpoint({
    summary: 'Update chargeback',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Chargeback was updated',
    role: RoleEnum.NO_AUTH,
  })
  @Post('chargeback/update')
  async updateChargeback(
    @Body() body: UpdateChargebackRequestDto,
  ): Promise<void> {
    await this.adminService.updateChargeback(body)
  }

  @ApiEndpoint({
    summary: 'Create pass',
    responseStatus: HttpStatus.OK,
    responseType: CreatePassResponseDto,
    responseDesc: 'Pass created',
    role: RoleEnum.NO_AUTH,
  })
  @Post('pass/create')
  async createManualPass(
    @Body() createManualPassDto: CreateManualPassRequestDto,
  ): Promise<CreatePassResponseDto> {
    return await this.adminService.manualPass(createManualPassDto)
  }

  @ApiEndpoint({
    summary: 'Update coveted member',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Coveted member updated',
    role: RoleEnum.NO_AUTH,
  })
  @Post('coveted/member/update')
  async updateCovetedMember(
    @Body() updateAgencyMemberDto: UpdateAgencyMemberDto,
  ): Promise<void> {
    await this.adminService.updateCovetedMember(updateAgencyMemberDto)
  }

  @ApiEndpoint({
    summary: 'Update coveted member',
    responseStatus: HttpStatus.OK,
    responseType: GetAgencyMembersResponseDto,
    responseDesc: 'Coveted member updated',
    role: RoleEnum.NO_AUTH,
  })
  @Post('coveted/members')
  async getCovetedMembers(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: AdminDto,
  ): Promise<GetAgencyMembersResponseDto> {
    return new GetAgencyMembersResponseDto(
      await this.adminService.getCovetedMembers(),
    )
  }
}
