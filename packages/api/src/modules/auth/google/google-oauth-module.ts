import { Module } from '@nestjs/common'

import { S3ContentModule } from '../../s3content/s3content.module'
import { CoreAuthModule } from '../core/core-auth.module'
import { JwtModule } from '../jwt/jwt.module'
import { GoogleOauthController } from './google-oauth.controller'
import { GoogleOauthStrategy } from './google-oauth.strategy'

@Module({
  imports: [CoreAuthModule, JwtModule, S3ContentModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy],
  exports: [],
})
export class GoogleOauthModule {}
