import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { PassEntity } from '../pass/entities/pass.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CollectionController } from './collection.controller'
import { CollectionService } from './collection.service'
import { CollectionEntity } from './entities/collection.entity'

@Module({
  imports: [
    MikroOrmModule.forFeature([CollectionEntity, PassEntity, UserEntity]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
