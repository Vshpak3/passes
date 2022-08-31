import { Module } from '@nestjs/common'

import { S3ContentModule } from '../../s3content/s3content.module'
import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { GoogleOauthController } from './google-oauth.controller'
import { GoogleOauthStrategy } from './google-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule, JwtRefreshModule, S3ContentModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy],
  exports: [],
})
export class GoogleOauthModule {}
