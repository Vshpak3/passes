import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CreatorSettingsService } from './creator-settings.service'
import { GetCreatorSettingsResponseDto } from './dto/get-creator-settings.dto'
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
    type: GetCreatorSettingsResponseDto,
    description: 'Creator Settings was retrieved',
  })
  @Get()
  async getCreatorSettings(
    @Req() req: RequestWithUser,
  ): Promise<GetCreatorSettingsResponseDto> {
    return await this.creatorSettingsService.findByUser(req.user.id)
  }

  @ApiOperation({ summary: 'Updates or create creator settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Creator Settings was updated or created',
  })
  @Post()
  async createOrUpdateCreatorSettings(
    @Req() req: RequestWithUser,
    @Body() updateCreatorSettingsDto: UpdateCreatorSettingsRequestDto,
  ): Promise<boolean> {
    return await this.creatorSettingsService.createOrUpdateCreatorSettings(
      req.user.id,
      updateCreatorSettingsDto,
    )
  }
}
