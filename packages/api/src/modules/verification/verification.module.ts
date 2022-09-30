import { Module } from '@nestjs/common'

import { JwtAuthModule } from '../auth/jwt/jwt-auth.module'
import { JwtRefreshModule } from '../auth/jwt/jwt-refresh.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { UserModule } from '../user/user.module'
import { VerificationController } from './verification.controller'
import { VerificationService } from './verification.service'

@Module({
  imports: [UserModule, S3ContentModule, JwtAuthModule, JwtRefreshModule],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
