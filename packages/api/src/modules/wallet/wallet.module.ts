import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { EthNftEntity } from '../eth/entities/eth-nft.entity'
import { EthNftCollectionEntity } from '../eth/entities/eth-nft-collection.entity'
import { EthService } from '../eth/eth.service'
import { LambdaService } from '../lambda/lambda.service'
import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from './entities/wallet.entity'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserEntity,
      WalletEntity,
      EthNftEntity,
      EthNftCollectionEntity,
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, EthService, RedisLockService, LambdaService],
})
export class WalletModule {}
