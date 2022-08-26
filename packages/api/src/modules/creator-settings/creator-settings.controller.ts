import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CreatorSettingsService } from './creator-settings.service'
import { CreateCreatorSettingsRequestDto } from './dto/create-creator-settings.dto'
import { UpdateCreatorSettingsRequestDto } from './dto/update-creator-settings.dto'

@ApiTags('creator-settings')
@Controller('creator-settings')
export class CreatorSettingsController {
  constructor(
    private readonly creatorSettingsService: CreatorSettingsService,
  ) {}

  @ApiOperation({ summary: 'Gets creator settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCreatorSettingsRequestDto,
    description: 'Creator Settings was retrieved',
  })
  @Get()
  async find(
    @Req() req: RequestWithUser,
  ): Promise<CreateCreatorSettingsRequestDto> {
    return await this.creatorSettingsService.findByUser(req.user.id)
  }

  @ApiOperation({ summary: 'Updates creator settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCreatorSettingsRequestDto,
    description: 'Creator Settings was updated',
  })
  @Patch()
  async update(
    @Req() req: RequestWithUser,
    @Body() updateCreatorSettingsDto: UpdateCreatorSettingsRequestDto,
  ): Promise<CreateCreatorSettingsRequestDto> {
    return await this.creatorSettingsService.update(
      req.user.id,
      updateCreatorSettingsDto,
    )
  }

  @ApiOperation({ summary: 'Creates creator settings' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCreatorSettingsRequestDto,
    description: 'Creator Settings was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createCreatorSettingsDto: CreateCreatorSettingsRequestDto,
  ): Promise<CreateCreatorSettingsRequestDto> {
    return await this.creatorSettingsService.create(
      req.user.id,
      createCreatorSettingsDto,
    )
  }
}
