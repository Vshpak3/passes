import { Module } from '@nestjs/common'
import { AccountSettingsService } from './account-settings.service'
import { AccountSettingsController } from './account-settings.controller'

@Module({
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService],
})
export class AccountSettingsModule {}
