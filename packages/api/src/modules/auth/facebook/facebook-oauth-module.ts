import { Module } from '@nestjs/common'

import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { FacebookOauthController } from './facebook-oauth.controller'
import { FacebookOauthStrategy } from './facebook-oauth.strategy'

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [FacebookOauthController],
  providers: [FacebookOauthStrategy],
})
export class FacebookOauthModule {}
