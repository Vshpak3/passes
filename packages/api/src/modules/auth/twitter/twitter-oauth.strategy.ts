import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Profile, Strategy } from 'passport-twitter'
import { Logger } from 'winston'

import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { AuthService } from '../core/auth.service'
import { AuthRecord } from '../core/auth-record'
import { validateUser } from '../helpers/oauth-strategy.helper'

export const TWITTER_OAUTH_PROVIDER = 'twitter'

@Injectable()
export class TwitterStrategy extends PassportStrategy(
  Strategy,
  TWITTER_OAUTH_PROVIDER,
) {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      consumerKey: configService.get('oauth.twitter.consumerKey'),
      consumerSecret: configService.get('oauth.twitter.consumerSecret'),
      callbackURL: configService.get('oauth.twitter.redirect_url'),
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<AuthRecord> {
    return validateUser.bind(this)(profile, TWITTER_OAUTH_PROVIDER)
  }
}
