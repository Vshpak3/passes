import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LambdaService } from '../lambda/lambda.service'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { WalletService } from '../wallet/wallet.service'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, WalletEntity], 'ReadWrite')],
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
