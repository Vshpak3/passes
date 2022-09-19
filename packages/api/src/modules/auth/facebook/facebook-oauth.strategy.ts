import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Profile, Strategy } from 'passport-facebook'
import { Logger } from 'winston'

import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { AuthService } from '../core/auth.service'
import { AuthRecord } from '../core/auth-record'
import { validateUser } from '../helpers/oauth-strategy.helper'

export const FACEBOOK_OAUTH_PROVIDER = 'facebook'

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(
  Strategy,
  FACEBOOK_OAUTH_PROVIDER,
) {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('oauth.facebook.id'),
      clientSecret: configService.get('oauth.facebook.secret'),
      callbackURL: configService.get('oauth.facebook.redirect_url'),
      scope: ['email'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<AuthRecord> {
    return validateUser.bind(this)(profile, FACEBOOK_OAUTH_PROVIDER)
  }
}
