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
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { GetUserDto } from './dto/get-user.dto'
import { SearchUserRequestDto } from './dto/search-user-request.dto'
import { SearchCreatorResponseDto } from './dto/search-user-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateUsernameDto } from './dto/update-username.dto'
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
  @UseGuards(JwtAuthGuard)
  @Post('username')
  async setUsername(
    @Req() req: RequestWithUser,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ): Promise<GetUserDto> {
    const updatedUser = await this.userService.setUsername(
      req.user.id,
      updateUsernameDto.username,
    )
    return new GetUserDto(updatedUser)
  }

  @ApiOperation({ summary: 'Search for creators by query' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SearchCreatorResponseDto,
    description: 'A list of creators was returned',
  })
  @Post('/creator/search')
  async searchCreatorByUsername(
    @Body() searchCreatorDto: SearchUserRequestDto,
  ): Promise<any> {
    const creators = await this.userService.searchByQuery(searchCreatorDto)
    return new SearchCreatorResponseDto(creators)
  }

  @ApiOperation({ summary: 'Gets a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserDto,
    description: 'A user was retrieved',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    return new GetUserDto(await this.userService.findOne(id))
  }

  @ApiOperation({ summary: 'Updates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserDto,
    description: 'A user was updated',
  })
  @Patch('')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return new GetUserDto(
      await this.userService.update(req.user.id, updateUserDto),
    )
  }

  @ApiOperation({ summary: 'Disables a user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A user account was disabled',
  })
  @Delete('')
  async delete(@Req() req: RequestWithUser): Promise<GetUserDto> {
    return new GetUserDto(await this.userService.remove(req.user.id))
  }

  @ApiOperation({ summary: 'Validates whether a username is available' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Validates whether a username is available',
  })
  @Get('/usernames/validate/:username')
  async validateUsername(
    @Param('username') username: string,
  ): Promise<boolean> {
    return this.userService.validateUsername(username)
  }
}
