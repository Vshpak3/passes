import { Module } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'
import { SettingsEntity } from './entities/settings.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([SettingsEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
