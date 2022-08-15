import { Module } from '@nestjs/common'

import { S3Module } from '../../s3/s3.module'
import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { FacebookComplianceService } from './facebook-compliance.service'
import { FacebookOauthController } from './facebook-oauth.controller'
import { FacebookOauthStrategy } from './facebook-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule, JwtRefreshModule, S3Module],
  controllers: [FacebookOauthController],
  providers: [FacebookOauthStrategy, FacebookComplianceService],
  exports: [FacebookComplianceService],
})
export class FacebookOauthModule {}
