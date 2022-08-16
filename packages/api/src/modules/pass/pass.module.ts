import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LambdaService } from '../lambda/lambda.service'
import { PaymentModule } from '../payment/payment.module'
import { S3Service } from '../s3/s3.service'
import { SolService } from '../sol/sol.service'
import { WalletService } from '../wallet/wallet.service'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
  imports: [PaymentModule],
  controllers: [PassController],
  providers: [
    PassService,
    SolService,
    LambdaService,
    WalletService,
    ConfigService,
    S3Service,
  ],
})
export class PassModule {}
