import { Module } from '@nestjs/common'

import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { TwitterOauthController } from './twitter-oauth.controller'
import { TwitterStrategy } from './twitter-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [TwitterOauthController],
  providers: [TwitterStrategy],
})
export class TwitterOauthModule {}
