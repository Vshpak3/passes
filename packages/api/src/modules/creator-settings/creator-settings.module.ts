import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import { CreatorSettingsController } from './creator-settings.controller'
import { CreatorSettingsService } from './creator-settings.service'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, CreatorSettingsEntity])],
  controllers: [CreatorSettingsController],
  providers: [CreatorSettingsService],
})
export class CreatorSettingsModule {}
