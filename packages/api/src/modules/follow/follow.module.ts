import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import { FollowEntity } from './entities/follow.entity'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

@Module({
  imports: [MikroOrmModule.forFeature([FollowEntity, UserEntity], 'ReadWrite')],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
