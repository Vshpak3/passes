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
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'
import { RequestWithUser } from '../../types'

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
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({ summary: 'Gets a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateUserDto,
    description: 'A user was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateUserDto> {
    return this.userService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A user was updated',
  })
  @Patch('')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto)
  }

  @ApiOperation({ summary: 'Disables a user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A user account was disabled',
  })
  @Delete('')
  async delete(@Req() req: RequestWithUser) {
    return this.userService.remove(req.user.id)
  }
}
