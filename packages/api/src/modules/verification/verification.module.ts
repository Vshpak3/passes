import { Module } from '@nestjs/common'

import { S3ContentModule } from '../s3content/s3content.module'
import { UserModule } from '../user/user.module'
import { VerificationController } from './verification.controller'
import { VerificationService } from './verification.service'

@Module({
  imports: [UserModule, S3ContentModule],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
