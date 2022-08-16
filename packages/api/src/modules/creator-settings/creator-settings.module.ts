import { Module } from '@nestjs/common'

import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'

@Module({
  imports: [],
  controllers: [CreatorSettingsController],
  providers: [CreatorSettingsService],
  exports: [CreatorSettingsService],
})
export class CreatorSettingsModule {}
