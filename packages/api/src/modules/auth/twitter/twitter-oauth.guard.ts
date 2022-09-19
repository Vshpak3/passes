import { AuthGuard } from '@nestjs/passport'

import { TWITTER_OAUTH_PROVIDER } from './twitter-oauth.strategy'

export class TwitterOauthGuard extends AuthGuard(TWITTER_OAUTH_PROVIDER) {}
