import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { EthNftCollectionEntity } from '../eth/entities/eth-nft-collection.entity'
import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { EthNftEntity } from './entities/eth-nft.entity'
import { EthController } from './eth.controller'
import { EthService } from './eth.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      EthNftEntity,
      EthNftCollectionEntity,
      WalletEntity,
      UserEntity,
    ]),
  ],
  controllers: [EthController],
  providers: [EthService, RedisLockService],
})
export class EthModule {}
