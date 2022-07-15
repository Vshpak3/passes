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
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Creates a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
    description: 'A user was created',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({ summary: 'Gets a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateUserDto,
    description: 'A user was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
    description: 'A user was updated',
  })
  @Patch('')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.update(req.user.id, updateUserDto)
  }

  @ApiOperation({ summary: 'Disables a user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A user account was disabled',
  })
  @Delete('')
  async delete(@Req() req: RequestWithUser): Promise<UserDto> {
    return this.userService.remove(req.user.id)
  }

  @ApiOperation({ summary: 'Validates whether a username is available' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: 'boolean',
    description: 'Validates whether a username is available',
  })
  @Get('/usernames/validate/:username')
  async validateUsername(
    @Param('username') username: string,
  ): Promise<boolean> {
    return this.userService.validateUsername(username)
  }
}
