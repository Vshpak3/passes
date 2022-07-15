import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from './../user/user.module'
import { AuthController } from './auth.controller'
import { FacebookOauthModule } from './facebook/facebook-oauth-module'
import { GoogleOauthModule } from './google/google-oauth-module'
import { JwtAuthModule } from './jwt/jwt-auth.module'
import { TwitterOauthModule } from './twitter/twitter-oauth-module'

@Module({
  imports: [
    UserModule,
    PassportModule,
    GoogleOauthModule,
    FacebookOauthModule,
    TwitterOauthModule,
    JwtAuthModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
