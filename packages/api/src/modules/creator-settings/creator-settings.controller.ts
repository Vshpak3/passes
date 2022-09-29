import { Body, Controller, Get, HttpStatus, Patch, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.metadata'
import { CreatorSettingsService } from './creator-settings.service'
import { GetCreatorSettingsResponseDto } from './dto/get-creator-settings.dto'
import { UpdateCreatorSettingsRequestDto } from './dto/update-creator-settings.dto'

@ApiTags('creator-settings')
@Controller('creator-settings')
export class CreatorSettingsController {
  constructor(
    private readonly creatorSettingsService: CreatorSettingsService,
  ) {}

  @ApiEndpoint({
    summary: 'Gets creator settings',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorSettingsResponseDto,
    responseDesc: 'Creator Settings was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Get()
  async getCreatorSettings(
    @Req() req: RequestWithUser,
  ): Promise<GetCreatorSettingsResponseDto> {
    return await this.creatorSettingsService.findByUser(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Updates creator settings',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Creator Settings was updated',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Patch()
  async updateCreatorSettings(
    @Req() req: RequestWithUser,
    @Body() updateCreatorSettingsDto: UpdateCreatorSettingsRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.creatorSettingsService.updateCreatorSettings(
        req.user.id,
        updateCreatorSettingsDto,
      ),
    )
  }
}
