import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { AccountSettingsService } from './account-settings.service'
import { CreateAccountSettingDto } from './dto/create-account-setting.dto'
import { UpdateAccountSettingDto } from './dto/update-account-setting.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('account-settings')
@Controller('api/account-settings')
export class AccountSettingsController {
  constructor(
    private readonly accountSettingsService: AccountSettingsService,
  ) {}

  @ApiOperation({ summary: 'TODO' })
  @Post()
  create(@Body() createAccountSettingDto: CreateAccountSettingDto) {
    return this.accountSettingsService.create(createAccountSettingDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Get()
  findAll() {
    return this.accountSettingsService.findAll()
  }

  @ApiOperation({ summary: 'TODO' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountSettingsService.findOne(+id)
  }

  @ApiOperation({ summary: 'TODO' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountSettingDto: UpdateAccountSettingDto,
  ) {
    return this.accountSettingsService.update(+id, updateAccountSettingDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountSettingsService.remove(+id)
  }
}
