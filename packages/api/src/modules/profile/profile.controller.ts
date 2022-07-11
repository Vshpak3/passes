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

import { RequestWithUser } from '../../types'
import { CreateProfileDto } from './dto/create-profile.dto'
import { GetProfileDto } from './dto/get-profile.dto'
import { GetUsernamesDto } from './dto/get-usernames.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileService } from './profile.service'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Creates a profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetProfileDto,
    description: 'A profile was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<GetProfileDto> {
    return this.profileService.create(req.user.id, createProfileDto)
  }

  @ApiOperation({ summary: 'Gets all usernames' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUsernamesDto,
    description: 'Gets all usernames',
  })
  @Get('/usernames')
  async getAllUsernames(): Promise<GetUsernamesDto> {
    return this.profileService.getAllUsernames()
  }

  @ApiOperation({ summary: 'Gets a profile by username' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileDto,
    description: 'A profile was retrieved',
  })
  @Get('/usernames/:username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<GetProfileDto> {
    return this.profileService.findOneByUsername(username)
  }

  @ApiOperation({ summary: 'Gets a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileDto,
    description: 'A profile was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetProfileDto> {
    return this.profileService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileDto,
    description: 'A profile was updated',
  })
  @Patch(':id')
  async update(
    @Param('id') profileId: string,
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<GetProfileDto> {
    return this.profileService.update(req.user.id, profileId, updateProfileDto)
  }

  @ApiOperation({ summary: 'Deletes a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetProfileDto,
    description: 'A profile was deleted',
  })
  @Delete(':id')
  async remove(
    @Param('id') profileId: string,
    @Req() req: RequestWithUser,
  ): Promise<GetProfileDto> {
    return this.profileService.remove(req.user.id, profileId)
  }
}
