import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Profile, Strategy } from 'passport-facebook'
import { Logger } from 'winston'

import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { UserDto } from '../../user/dto/user.dto'
import { UserService } from '../../user/user.service'
import { validateUser } from '../helpers/oauth-strategy.helper'

const FACEBOOK_OAUTH_PROVIDER = 'twitter'

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
    private readonly usersService: UserService,
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
  ): Promise<UserDto> {
    return validateUser.bind(this)(profile, FACEBOOK_OAUTH_PROVIDER)
  }
}
