import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
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
    responseType: BooleanResponseDto,
    responseDesc: 'A profile was created',
    role: RoleEnum.GENERAL,
  })
  @Post()
  async createOrUpdateProfile(
    @Req() req: RequestWithUser,
    @Body() createOrUpdateProfileRequestDto: CreateOrUpdateProfileRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.profileService.createOrUpdateProfile(
        req.user.id,
        createOrUpdateProfileRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Gets a profile',
    responseStatus: HttpStatus.OK,
    responseType: GetProfileResponseDto,
    responseDesc: 'A profile was retrieved',
    role: RoleEnum.NO_AUTH,
  })
  @Post('find')
  async findProfile(
    @Req() req: RequestWithUser,
    @Body() getProfileRequestDto: GetProfileRequestDto,
  ): Promise<GetProfileResponseDto> {
    return await this.profileService.findProfile(
      getProfileRequestDto,
      req.user?.id,
    )
  }

  @ApiEndpoint({
    summary: 'Deactivate a profile',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A profile was deactivated',
    role: RoleEnum.GENERAL,
  })
  @Delete('deactivate')
  async deactivateProfile(
    @Req() req: RequestWithUser,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.profileService.deactivateProfile(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Activate a profile',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A profile was activated',
    role: RoleEnum.GENERAL,
  })
  @Patch('activate')
  async activateProfile(
    @Req() req: RequestWithUser,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.profileService.activateProfile(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Check if profile is active',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Profile status was returned',
    role: RoleEnum.GENERAL,
  })
  @Get('active')
  async isProfileActive(
    @Req() req: RequestWithUser,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.profileService.isProfileActive(req.user.id),
    )
  }
}
