import { Module } from '@nestjs/common'

import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'

@Module({
  controllers: [CreatorSettingsController],
  providers: [CreatorSettingsService],
})
export class CreatorSettingsModule {}
