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
import { GetUserResponseDto } from './dto/get-user.dto'
import {
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
} from './dto/search-creator.dto'
import { UpdateUserRequestDto } from './dto/update-user.dto'
import { UpdateUsernameRequestDto } from './dto/update-username.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Set username for current user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A username was set for the current user',
  })
  @Post('username')
  async setUsername(
    @Req() req: RequestWithUser,
    @Body() updateUsernameDto: UpdateUsernameRequestDto,
  ): Promise<GetUserResponseDto> {
    const updatedUser = await this.userService.setUsername(
      req.user.id,
      updateUsernameDto.username,
    )
    return new GetUserResponseDto(updatedUser)
  }

  @ApiOperation({ summary: 'Search for creators by query' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SearchCreatorResponseDto,
    description: 'A list of creators was returned',
  })
  @Post('/creator/search')
  async searchCreatorByUsername(
    @Body() searchCreatorDto: SearchCreatorRequestDto,
  ): Promise<any> {
    const creators = await this.userService.searchByQuery(searchCreatorDto)
    return new SearchCreatorResponseDto(creators)
  }

  @ApiOperation({ summary: 'Gets a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserResponseDto,
    description: 'A user was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserResponseDto> {
    return new GetUserResponseDto(await this.userService.findOne(id))
  }

  @ApiOperation({ summary: 'Updates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserResponseDto,
    description: 'A user was updated',
  })
  @Patch()
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<GetUserResponseDto> {
    return new GetUserResponseDto(
      await this.userService.update(req.user.id, updateUserDto),
    )
  }

  @ApiOperation({ summary: 'Disables a user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A user account was disabled',
  })
  @Delete()
  async delete(@Req() req: RequestWithUser): Promise<GetUserResponseDto> {
    return new GetUserResponseDto(await this.userService.remove(req.user.id))
  }

  @ApiOperation({ summary: 'Validates whether a username is available' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A username was checked for validity',
  })
  @Get('/usernames/validate/:username')
  @AllowUnauthorizedRequest()
  async validateUsername(
    @Param('username') username: string,
  ): Promise<boolean> {
    return this.userService.validateUsername(username)
  }

  /*
  -------------------------------------------------------------------------------
  TEST (to be removed)
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Make yourself a creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'You were made a creator',
  })
  @Get('make/creator')
  async makeCreator(@Req() req: RequestWithUser): Promise<void> {
    return await this.userService.makeCreator(req.user.id)
  }
}
