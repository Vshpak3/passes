import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { CollectionEntity } from '../collection/entities/collection.entity'
import { LambdaService } from '../lambda/lambda.service'
import { SolNftEntity } from '../sol/entities/sol-nft.entity'
import { SolNftCollectionEntity } from '../sol/entities/sol-nft-collection.entity'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { WalletService } from '../wallet/wallet.service'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      SolNftCollectionEntity,
      CollectionEntity,
      PassEntity,
      PassOwnershipEntity,
      UserEntity,
      SolNftEntity,
      WalletEntity,
    ]),
  ],
  controllers: [PassController],
  providers: [
    PassService,
    SolService,
    LambdaService,
    WalletService,
    ConfigService,
  ],
})
export class PassModule {}
