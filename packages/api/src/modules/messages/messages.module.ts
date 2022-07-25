import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { GemBalanceEntity } from '../gem/entities/gem.balance.entity'
import { GemPackageEntity } from '../gem/entities/gem.package.entity'
import { GemTransactionEntity } from '../gem/entities/gem.transaction.entity'
import { GemService } from '../gem/gem.service'
import { UserEntity } from '../user/entities/user.entity'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserEntity,
      CreatorSettingsEntity,
      GemTransactionEntity,
      GemBalanceEntity,
      GemPackageEntity,
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, GemService],
})
export class MessagesModule {}
