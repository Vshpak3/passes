import { Module } from '@nestjs/common'

import { S3Module } from '../../s3/s3.module'
import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { TwitterOauthController } from './twitter-oauth.controller'
import { TwitterStrategy } from './twitter-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule, JwtRefreshModule, S3Module],
  controllers: [TwitterOauthController],
  providers: [TwitterStrategy],
})
export class TwitterOauthModule {}
