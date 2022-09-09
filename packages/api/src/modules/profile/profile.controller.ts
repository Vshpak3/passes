import { Body, Controller, Delete, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { AllowUnauthorizedRequest } from '../auth/auth.metadata'
import { CreateOrUpdateProfileRequestDto } from './dto/create-or-update-profile.dto'
import {
  GetProfileRequestDto,
  GetProfileResponseDto,
} from './dto/get-profile.dto'
import { ProfileService } from './profile.service'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiEndpoint({
    summary: 'Creates a profile',
    responseStatus: HttpStatus.CREATED,
    responseType: Boolean,
    responseDesc: 'A profile was created',
  })
  @Post()
  async createOrUpdateProfile(
    @Req() req: RequestWithUser,
    @Body() createOrUpdateProfileRequestDto: CreateOrUpdateProfileRequestDto,
  ): Promise<boolean> {
    return this.profileService.createOrUpdateProfile(
      req.user.id,
      createOrUpdateProfileRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets a profile',
    responseStatus: HttpStatus.OK,
    responseType: GetProfileResponseDto,
    responseDesc: 'A profile was retrieved',
    allowUnauthorizedRequest: true,
  })
  // eslint-disable-next-line sonarjs/no-duplicate-string
  @Post('get')
  @AllowUnauthorizedRequest()
  async findProfile(
    @Req() req: RequestWithUser,
    @Body() getProfileRequestDto: GetProfileRequestDto,
  ): Promise<GetProfileResponseDto> {
    return this.profileService.findProfile(getProfileRequestDto, req.user?.id)
  }

  @ApiEndpoint({
    summary: 'Deactivate a profile',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A profile was deactivated',
  })
  @Delete('deactivate')
  async deactivateProfile(@Req() req: RequestWithUser): Promise<boolean> {
    return this.profileService.deactivateProfile(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Activate a profile',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A profile was activated',
  })
  @Delete('activate')
  async activateProfile(@Req() req: RequestWithUser): Promise<boolean> {
    return this.profileService.activateProfile(req.user.id)
  }
}
