import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { TWITTER_OAUTH_PROVIDER } from './twitter-oauth.strategy'

@Injectable()
export class TwitterOauthGuard extends AuthGuard(TWITTER_OAUTH_PROVIDER) {}
