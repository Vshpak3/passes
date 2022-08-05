import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { SettingsEntity } from './entities/settings.entity'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

@Module({
  imports: [MikroOrmModule.forFeature([SettingsEntity], 'ReadWrite')],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
