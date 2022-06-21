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
import { ProfileService } from './profile.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Creates a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateProfileDto,
    description: 'A profile was created',
  })
  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<CreateProfileDto> {
    return this.profileService.create(createProfileDto)
  }

  @ApiOperation({ summary: 'Gets a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateProfileDto,
    description: 'A profile was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateProfileDto> {
    return this.profileService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A profile was updated',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updateProfileDto)
  }

  @ApiOperation({ summary: 'Deletes a profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A profile was deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.profileService.remove(id)
  }
}
