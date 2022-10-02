import { Module } from '@nestjs/common'

import { S3ContentModule } from '../../s3content/s3content.module'
import { CoreAuthModule } from '../core/core-auth.module'
import { JwtModule } from '../jwt/jwt.module'
import { TwitterOauthController } from './twitter-oauth.controller'
import { TwitterStrategy } from './twitter-oauth.strategy'

@Module({
  imports: [CoreAuthModule, JwtModule, S3ContentModule],
  controllers: [TwitterOauthController],
  providers: [TwitterStrategy],
  exports: [],
})
export class TwitterOauthModule {}
