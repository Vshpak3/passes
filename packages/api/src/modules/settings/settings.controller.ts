import { Body, Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GetSettingsResponseDto } from './dto/get-settings.dto'
import { UpdateSettingsRequestDto } from './dto/update-settings.dto'
import { SettingsService } from './settings.service'

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Gets settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSettingsResponseDto,
    description: 'Settings were retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetSettingsResponseDto> {
    return this.settingsService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Settings were updated',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateSettingsRequestDto,
  ) {
    return this.settingsService.update(id, updateSettingsDto)
  }
}
