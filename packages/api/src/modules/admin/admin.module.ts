import { Module } from '@nestjs/common'

import { JwtModule } from '../auth/jwt/jwt.module'
import { PassModule } from '../pass/pass.module'
import { PaymentModule } from '../payment/payment.module'
import { ProfileModule } from '../profile/profile.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { UserModule } from '../user/user.module'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
  imports: [
    JwtModule,
    PaymentModule,
    ProfileModule,
    S3ContentModule,
    UserModule,
    PassModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [],
})
export class AdminModule {}
