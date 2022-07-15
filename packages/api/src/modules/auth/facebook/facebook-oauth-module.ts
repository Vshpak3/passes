import { Module } from '@nestjs/common'

import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { FacebookOauthController } from './facebook-oauth.controller'
import { FacebookOauthStrategy } from './facebook-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule, JwtRefreshModule],
  controllers: [FacebookOauthController],
  providers: [FacebookOauthStrategy],
})
export class FacebookOauthModule {}
