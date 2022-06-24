import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Creates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
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
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }
}
