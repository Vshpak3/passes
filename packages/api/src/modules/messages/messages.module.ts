import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { UserEntity } from '../user/entities/user.entity'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity, CreatorSettingsEntity], 'ReadWrite'),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
