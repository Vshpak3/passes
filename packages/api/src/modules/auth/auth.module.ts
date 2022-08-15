import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'

import { S3Module } from '../s3/s3.module'
import { UserModule } from './../user/user.module'
import { AuthController } from './auth.controller'
import { FacebookOauthModule } from './facebook/facebook-oauth-module'
import { GoogleOauthModule } from './google/google-oauth-module'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { JwtAuthModule } from './jwt/jwt-auth.module'
import { JwtRefreshModule } from './jwt/jwt-refresh.module'
import { LocalAuthModule } from './local/local.module'
import { TwitterOauthModule } from './twitter/twitter-oauth-module'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    UserModule,
    PassportModule,
    GoogleOauthModule,
    FacebookOauthModule,
    TwitterOauthModule,
    LocalAuthModule,
    JwtAuthModule,
    JwtRefreshModule,
    S3Module,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
