import { Module } from '@nestjs/common'

import { S3ContentModule } from '../../s3content/s3content.module'
import { CoreAuthModule } from '../core/core-auth.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { FacebookComplianceService } from './facebook-compliance.service'
import { FacebookOauthController } from './facebook-oauth.controller'
import { FacebookOauthStrategy } from './facebook-oauth.strategy'

@Module({
  imports: [CoreAuthModule, JwtAuthModule, JwtRefreshModule, S3ContentModule],
  controllers: [FacebookOauthController],
  providers: [FacebookOauthStrategy, FacebookComplianceService],
  exports: [FacebookComplianceService],
})
export class FacebookOauthModule {}
