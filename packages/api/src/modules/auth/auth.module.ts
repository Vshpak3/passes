import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { CoreAuthModule } from './core/core-auth.module'
import { FacebookOauthModule } from './facebook/facebook-oauth-module'
import { GoogleOauthModule } from './google/google-oauth-module'
import { JwtCreatorOnlyModule } from './jwt/creator-only/jwt-creator-only.module'
import { JwtGeneralModule } from './jwt/general/jwt-general.module'
import { JwtNoAuthModule } from './jwt/no-auth/jwt-no-auth.module'
import { JwtRefreshModule } from './jwt/refresh/jwt-refresh.module'
import { JwtUnverifiedModule } from './jwt/unverified/jwt-unverified.module'
import { LocalAuthModule } from './local/local.module'
import { TwitterOauthModule } from './twitter/twitter-oauth-module'

@Module({
  imports: [
    CoreAuthModule,
    FacebookOauthModule,
    GoogleOauthModule,
    JwtCreatorOnlyModule,
    JwtGeneralModule,
    JwtNoAuthModule,
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
