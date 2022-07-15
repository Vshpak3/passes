import { Module } from '@nestjs/common'

import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { GoogleOauthController } from './google-oauth.controller'
import { GoogleOauthStrategy } from './google-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule, JwtRefreshModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy],
})
export class GoogleOauthModule {}
