import { Controller, Get, Body, Patch, Param, HttpStatus } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { CreateSettingsDto } from './dto/create-settings.dto'
import { UpdateSettingsDto } from './dto/update-settings.dto'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Gets settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateSettingsDto,
    description: 'Settings were retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateSettingsDto> {
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
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.update(id, updateSettingsDto)
  }
}
