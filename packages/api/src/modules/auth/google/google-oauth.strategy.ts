import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Profile, Strategy } from 'passport-google-oauth20'
import { Logger } from 'winston'

import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { UserDto } from '../../user/dto/user.dto'
import { UserService } from '../../user/user.service'
import { validateUser } from '../helpers/oauth-strategy.helper'

const GOOGLE_OAUTH_PROVIDER = 'google'

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_OAUTH_PROVIDER,
) {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      clientID: configService.get('oauth.google.id'),
      clientSecret: configService.get('oauth.google.secret'),
      callbackURL: configService.get('oauth.google.redirect_url'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<UserDto> {
    return validateUser.bind(this)(profile, GOOGLE_OAUTH_PROVIDER, true)
  }
}
