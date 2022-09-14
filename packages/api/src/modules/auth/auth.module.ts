import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'

import { CoreAuthModule } from './core/core-auth.module'
import { FacebookOauthModule } from './facebook/facebook-oauth-module'
import { GoogleOauthModule } from './google/google-oauth-module'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { JwtRefreshModule } from './jwt/jwt-refresh.module'
import { JwtUnverifiedModule } from './jwt/jwt-unverified.module'
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
    CoreAuthModule,
    FacebookOauthModule,
    GoogleOauthModule,
    JwtRefreshModule,
    JwtUnverifiedModule,
    LocalAuthModule,
    PassportModule,
    TwitterOauthModule,
  ],
  controllers: [],
  exports: [],
})
export class AuthModule {}
