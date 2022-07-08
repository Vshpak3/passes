import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from './entities/wallet.entity'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, WalletEntity])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
