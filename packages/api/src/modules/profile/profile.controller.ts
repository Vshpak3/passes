import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { AllowUnauthorizedRequest } from '../auth/auth.metadata'
import { CreateOrUpdateProfileRequestDto } from './dto/create-or-update-profile.dto'
import { GetProfileResponseDto } from './dto/get-profile.dto'
import { GetUsernamesResponseDto } from './dto/get-usernames.dto'
import { ProfileService } from './profile.service'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Creates a profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: 'A profile was created',
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

  @ApiOperation({ summary: 'Gets all usernames' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUsernamesResponseDto,
    description: 'Gets all usernames',
  })
  @Get('usernames')
  async getAllUsernames(): Promise<GetUsernamesResponseDto> {
    return this.profileService.getAllUsernames()
  }

  @ApiOperation({ summary: 'Gets a profile by username' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileResponseDto,
    description: 'A profile was retrieved',
  })
  @AllowUnauthorizedRequest()
  @Get('usernames/:username')
  async findProfileByUsername(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
  ): Promise<GetProfileResponseDto> {
    return this.profileService.findProfileByUsername(username, req.user?.id)
  }

  @ApiOperation({ summary: 'Gets a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileResponseDto,
    description: 'A profile was retrieved',
  })
  @AllowUnauthorizedRequest()
  // eslint-disable-next-line sonarjs/no-duplicate-string
  @Get(':profileId')
  async findProfile(
    @Req() req: RequestWithUser,
    @Param('profileId') profileId: string,
  ): Promise<GetProfileResponseDto> {
    return this.profileService.findProfile(profileId, req.user?.id)
  }

  @ApiOperation({ summary: 'Deletes a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A profile was deleted',
  })
  @Delete(':profileId')
  async removeProfile(
    @Req() req: RequestWithUser,
    @Param('profileId') profileId: string,
  ): Promise<boolean> {
    return this.profileService.removeProfile(req.user.id, profileId)
  }
}
