import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LambdaService } from '../lambda/lambda.service'
import { SolService } from '../sol/sol.service'
import { WalletService } from '../wallet/wallet.service'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
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
