import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { CollectionEntity } from '../collection/entities/collection.entity'
import { UserEntity } from '../user/entities/user.entity'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CollectionEntity,
      PassEntity,
      PassOwnershipEntity,
      UserEntity,
    ]),
  ],
  controllers: [PassController],
  providers: [PassService],
})
export class PassModule {}
