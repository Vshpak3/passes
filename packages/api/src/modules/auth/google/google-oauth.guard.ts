import { AuthGuard } from '@nestjs/passport'

import { GOOGLE_OAUTH_PROVIDER } from './google-oauth.strategy'

export class GoogleOauthGuard extends AuthGuard(GOOGLE_OAUTH_PROVIDER) {}
