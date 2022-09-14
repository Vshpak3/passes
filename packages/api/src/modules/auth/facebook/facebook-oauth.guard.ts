import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { FACEBOOK_OAUTH_PROVIDER } from './facebook-oauth.strategy'

@Injectable()
export class FacebookOauthGuard extends AuthGuard(FACEBOOK_OAUTH_PROVIDER) {}
