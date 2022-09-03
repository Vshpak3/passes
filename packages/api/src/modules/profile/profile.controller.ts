import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { AllowUnauthorizedRequest } from '../auth/auth.metadata'
import { CreateProfileRequestDto } from './dto/create-profile.dto'
import { GetProfileResponseDto } from './dto/get-profile.dto'
import { GetUsernamesResponseDto } from './dto/get-usernames.dto'
import { UpdateProfileRequestDto } from './dto/update-profile.dto'
import { ProfileService } from './profile.service'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Creates a profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetProfileResponseDto,
    description: 'A profile was created',
  })
  @Post()
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileRequestDto,
  ): Promise<GetProfileResponseDto> {
    return this.profileService.createProfile(req.user.id, createProfileDto)
  }

  @ApiOperation({ summary: 'Gets all usernames' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUsernamesResponseDto,
    description: 'Gets all usernames',
  })
  @Get('/usernames')
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
  @Get('/usernames/:username')
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

  @ApiOperation({ summary: 'Updates a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileResponseDto,
    description: 'A profile was updated',
  })
  @Patch(':profileId')
  async updateProfile(
    @Param('profileId') profileId: string,
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileRequestDto,
  ): Promise<GetProfileResponseDto> {
    return this.profileService.updateProfile(
      req.user.id,
      profileId,
      updateProfileDto,
    )
  }

  @ApiOperation({ summary: 'Deletes a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileResponseDto,
    description: 'A profile was deleted',
  })
  @Delete(':profileId')
  async removeProfile(
    @Param('profileId') profileId: string,
    @Req() req: RequestWithUser,
  ): Promise<GetProfileResponseDto> {
    return this.profileService.removeProfile(req.user.id, profileId)
  }
}
